import { authFetch } from "../utilities/authFetch";
import { calculateStats } from "../utilities/currencyCalculations";

class AiService {
  async getAiForecast(payload, auth, setAuth) {
    const url = `${import.meta.env.VITE_URL}/api/gemini/AiPredictions`;

    const response = await authFetch(
      url,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      auth,
      setAuth,
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  }

  async getAiHistorical(payload, auth, setAuth) {
    const url = `${import.meta.env.VITE_URL}/api/gemini/AiHistorical`;

    const response = await authFetch(
      url,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      auth,
      setAuth,
    );

    if (!response.ok) {
      console.log(response);
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  }
}

const aiService = new AiService();
export default aiService;
