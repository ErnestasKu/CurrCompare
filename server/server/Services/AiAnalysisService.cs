//namespace server.Services
//{
//    public class AiAnalysisService
//    {
//        private readonly string _apiKey;
//        private readonly GenerativeModel _model;

//        public AiAnalysisService(IConfiguration config)
//        {
//            _apiKey = config["AppSettings:GeminiApiKey"];
//            var client = new GenerativeLanguageClientBuilder
//            {
//                ApiKey = _apiKey
//            }.Build();

//            // Use gemini-1.5-flash for speed and free-tier optimization
//            _model = new GenerativeModel(client, "gemini-1.5-flash");
//        }

//        public async Task<string> GetCurrencyInsightAsync(string baseCurr, string targetCurr, List<RateData> history)
//        {
//            // 1. Prepare the data for the AI
//            var startRate = history.First().Rate;
//            var endRate = history.Last().Rate;
//            var change = ((endRate - startRate) / startRate) * 100;

//            // 2. Build the prompt
//            string prompt = $@"
//            Analyze the currency pair {baseCurr}/{targetCurr}.
//            Period: {history.First().Date:yyyy-MM-dd} to {history.Last().Date:yyyy-MM-dd}.
//            Movement: Started at {startRate}, ended at {endRate} ({change:F2}% change).
            
//            Identify the major global economic reasons for this specific movement. 
//            Keep the answer to 3 concise bullet points.";

//            // 3. Call Gemini
//            var response = await _model.GenerateContentAsync(prompt);
//            return response.Text;
//        }
//    }
//}
