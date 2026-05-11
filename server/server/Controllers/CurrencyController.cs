using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Caching.Memory;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CurrencyController : ControllerBase
    {
        private readonly IMemoryCache _cache;
        private readonly IHttpClientFactory _httpClientFactory;
        public CurrencyController(IHttpClientFactory httpClientFactory, IMemoryCache cache)
        {
            _httpClientFactory = httpClientFactory;
            _cache = cache;
        }

        private DateTimeOffset GetCacheExpiration()
        {
            // frankfurter updates daily around 16:00 CET
            var CET = TimeZoneInfo.FindSystemTimeZoneById("Europe/Berlin");
            var nowInCET = TimeZoneInfo.ConvertTime(DateTime.UtcNow, CET);

            var nextUpdate = nowInCET.Date.AddHours(16);

            // if past 16:00 today, the next update is tomorrow
            if (nowInCET >= nextUpdate)
                nextUpdate = nextUpdate.AddDays(1);

            return TimeZoneInfo.ConvertTimeToUtc(nextUpdate, CET);
        }

        [HttpGet("currency-data")]
        public async Task<IActionResult> GetCurrencyData(
            [FromQuery] string? baseCode,
            [FromQuery] string? quotesCode,
            [FromQuery] DateTime? start = null,
            [FromQuery] DateTime? end = null)
        {

            // date check
            if (start.HasValue && end.HasValue && start > end)
                return BadRequest("Start date must be before end date");

            var client = _httpClientFactory.CreateClient("Frankfurter");
            var queryParams = new Dictionary<string, string?>();

            if (!string.IsNullOrWhiteSpace(baseCode))
                queryParams["base"] = baseCode.ToUpper();

            if (!string.IsNullOrWhiteSpace(quotesCode))
                queryParams["quotes"] = quotesCode.ToUpper();

            if (start.HasValue)
                queryParams["from"] = start.Value.ToString("yyyy-MM-dd");

            if (end.HasValue)
                queryParams["to"] = end.Value.ToString("yyyy-MM-dd");

            var url = QueryHelpers.AddQueryString("rates", queryParams);

            // cache check
            string cacheKey = url;
            if (_cache.TryGetValue(cacheKey, out string? cachedJson) && cachedJson is not null)
                return Content(cachedJson, "application/json");

            try
            {
                var response = await client.GetAsync(url);
                if (!response.IsSuccessStatusCode)
                    return StatusCode((int)response.StatusCode, "External API error");

                var jsonData = await response.Content.ReadAsStringAsync();
                var cacheOptions = new MemoryCacheEntryOptions()
                    .SetAbsoluteExpiration(GetCacheExpiration())
                    .SetSlidingExpiration(TimeSpan.FromHours(1));

                _cache.Set(cacheKey, jsonData, cacheOptions);
                return Content(jsonData, "application/json");
            }
            catch (HttpRequestException)
            {
                return StatusCode(503, "Service unavailable");
            }
        }
    }
}
