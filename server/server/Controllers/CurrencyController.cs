using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CurrencyController : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;
        public CurrencyController(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        // converts xml data to json string
        private string xmlToJson(string xmlData)
        {
            var xmlDoc = new System.Xml.XmlDocument();
            xmlDoc.LoadXml(xmlData);
            string jsonString = Newtonsoft.Json.JsonConvert.SerializeXmlNode(xmlDoc);
            return jsonString;
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

            try
            {
                var response = await client.GetAsync(url);

                if (!response.IsSuccessStatusCode)
                    return StatusCode((int)response.StatusCode, "External API error");

                var jsonData = await response.Content.ReadAsStringAsync();
                return Content(jsonData, "application/json");
            }
            catch (HttpRequestException e)
            {
                return StatusCode(503, "Service unavailable");
            }
        }
    }
}
