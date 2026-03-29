using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Xml.Linq;

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

        [HttpGet("supported-currencies")]
        public async Task<IActionResult> GetSupportedCurrencies()
        {
            var client = _httpClientFactory.CreateClient("BankOfLithuania");
            var response = await client.GetAsync("getCurrencyList");

            if (response.IsSuccessStatusCode)
            {
                var xmlData = await response.Content.ReadAsStringAsync();
                string jsonString = xmlToJson(xmlData);
                return Ok(jsonString);
            }

            return StatusCode((int)response.StatusCode, "Error fetching data");
        }

        [HttpGet("currency-historical")]
        public async Task<IActionResult> GetCurrencyHistorical(string currency, DateTime start, DateTime end)
        {
            var client = _httpClientFactory.CreateClient("BankOfLithuania");
            var content = new FormUrlEncodedContent(new[]
            {
                new KeyValuePair<string, string>("tp", "EU"),
                new KeyValuePair<string, string>("ccy", currency),
                new KeyValuePair<string, string>("dtFrom", start.ToString("yyyy-MM-dd")),
                new KeyValuePair<string, string>("dtTo", end.ToString("yyyy-MM-dd"))
            });


            var response = await client.PostAsync("getFxRatesForCurrency", content);

            if (response.IsSuccessStatusCode)
            {
                var xmlData = await response.Content.ReadAsStringAsync();
                string jsonString = xmlToJson(xmlData);
                return Ok(jsonString);
            }

            return StatusCode((int)response.StatusCode, "Error fetching data");
        }
    }
}
