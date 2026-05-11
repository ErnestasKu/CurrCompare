import { calculateStats } from "../utilities/currencyCalculations";

class AiService {
  async getAiForecast(payload, token) {
    const url = `${import.meta.env.VITE_URL}/api/gemini/AiPredictions`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  }

  async getAiHistorical(payload, token) {
    const url = `${import.meta.env.VITE_URL}/api/gemini/AiHistorical`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
      credentials: "include",
    });

    if (!response.ok) {
      console.log(response);
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  }
}

const aiService = new AiService();
export default aiService;
