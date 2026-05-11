using Google.GenAI;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using server.Models;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class GeminiController : ControllerBase
    {
        private readonly string _model;
        private readonly string _apiKey;
        private readonly Client _client;
        private readonly IMemoryCache _cache;
        public GeminiController(IConfiguration config, IMemoryCache cache)
        {
            _apiKey = config["AppSettings:GOOGLE_API_KEY"];
            _model = config["AppSettings:GOOGLE_API_MODEL"];
            _client = new Client(apiKey: _apiKey);
            _cache = cache;
        }

        [HttpPost("AiPredictions")]
        public async Task<ActionResult<string>> GetAiPredictions([FromBody] AiRequestDto request)
        {
            // cache check
            string cacheKey =
                $"pred" +
                $"_{request.BaseCurrency}" +
                $"_{request.TargetCurrency}" +
                $"_{request.StartDate:yyyyMMdd}" +
                $"_{request.EndDate:yyyyMMdd}";

            if (_cache.TryGetValue(cacheKey, out string? cachedData))
                return Ok(new { prediction = cachedData });

            string prompt =
                $@"You are a financial market analyst.
                
                Currency pair: {request.BaseCurrency}/{request.TargetCurrency}
                Period: {request.StartDate:yyyy-MM-dd} to {request.EndDate:yyyy-MM-dd}

                Data stats:
                - Current rate: {request.Stats.Current}
                - Highest rate: {request.Stats.Max}
                - Lowest rate: {request.Stats.Min}
                - Percentage change: {request.Stats.Change:F2}%

                Interpretation rule:
                - Treat {request.TargetCurrency} as the asset being analyzed.
                - Treat {request.BaseCurrency} only as a reference currency for comparison.

                Return EXACTLY in this format:

                Sentiment: Bullish | Bearish | Neutral

                Short-term outlook: 1-3 sentences

                Observation: technical analysis

                Risk: key risk factor

                Rules:
                - No bullet points
                - Do not use abbreviations for institutions or banks.
                - Maximum 200 words.
                - No markdown
                - No extra text
                - No additional headers.";

            try
            {
                var response = await _client.Models.GenerateContentAsync(
                    model: _model,
                    contents: prompt
                );

                if (response.Candidates is null || response.Candidates.Count == 0)
                    return BadRequest("AI could not generate a response.");

                var text = response.Candidates[0].Content?.Parts?.FirstOrDefault()?.Text;

                if (string.IsNullOrWhiteSpace(text))
                    return BadRequest("AI could not generate a response.");

                // set cache
                var cacheOptions = new MemoryCacheEntryOptions().SetSlidingExpiration(TimeSpan.FromHours(5));
                _cache.Set(cacheKey, text, cacheOptions);

                return Ok(new { prediction = text });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"AI Error: {ex}");
                return StatusCode(500, new { error = ex.Message, details = ex.InnerException?.Message });
            }
        }

        [HttpPost("AiHistorical")]
        public async Task<ActionResult<string>> GetAiHistorical([FromBody] AiRequestDto request)
        {
            // cache check
            string cacheKey =
                $"hist" +
                $"_{request.BaseCurrency}" +
                $"_{request.TargetCurrency}" +
                $"_{request.StartDate:yyyyMMdd}" +
                $"_{request.EndDate:yyyyMMdd}";

            if (_cache.TryGetValue(cacheKey, out string? cachedData))
                return Ok(new { historical = cachedData });

            string prompt =
                $@"You are a financial market analyst specializing in historical currency movement analysis.
                
                Currency pair: {request.BaseCurrency}/{request.TargetCurrency}
                Period: {request.StartDate:yyyy-MM-dd} to {request.EndDate:yyyy-MM-dd}

                Data stats:
                - Current rate: {request.Stats.Current}
                - Highest rate: {request.Stats.Max}
                - Lowest rate: {request.Stats.Min}
                - Percentage change: {request.Stats.Change:F2}%

                Interpretation rule:
                - Treat {request.TargetCurrency} as the asset being analyzed.
                - Treat {request.BaseCurrency} only as a reference currency for comparison.

                Task:
                Explain the most likely reasons behind movements in the TARGET currency over this period.

                Return EXACTLY in this format:

                Summary: ...

                Primary drivers: ...

                Technical factors: ...

                Market context: ...

                Key insight: ...

                Rules:
                - No markdown
                - No bullet points
                - No extra text outside the format
                - Keep each section concise (1-2 sentences max)";

            try
            {
                var response = await _client.Models.GenerateContentAsync(
                    model: _model,
                    contents: prompt
                );

                if (response.Candidates is null || response.Candidates.Count == 0)
                    return BadRequest("AI could not generate a response.");

                var text = response.Candidates[0].Content?.Parts?.FirstOrDefault()?.Text;

                if (string.IsNullOrWhiteSpace(text))
                    return BadRequest("AI could not generate a response.");

                // set cache
                var cacheOptions = new MemoryCacheEntryOptions().SetSlidingExpiration(TimeSpan.FromHours(5));
                _cache.Set(cacheKey, text, cacheOptions);

                return Ok(new { historical = text });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"AI Error: {ex}");
                return StatusCode(500, new { error = ex.Message, details = ex.InnerException?.Message });
            }
        }
    }
}
