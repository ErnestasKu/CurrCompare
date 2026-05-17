import { authFetch } from "../utilities/authFetch";

class CrossRateService {
  // get user saved crossrate layout
  async get(userId, auth, setAuth) {
    if (!userId) return null;

    const url = `${import.meta.env.VITE_URL}/api/crossrate/settings/${userId}`;

    try {
      const response = await authFetch(
        url,
        {
          method: "GET",
        },
        auth,
        setAuth,
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to fetch crossrate settings:", error.message);
      return null;
    }
  }

  // update user saved crossrate layout
  async updateSettings(userId, settings, auth, setAuth) {
    if (!userId) return null;

    const url = `${import.meta.env.VITE_URL}/api/crossrate/settings/${userId}`;

    try {
      const response = await authFetch(
        url,
        {
          method: "PUT",
          body: JSON.stringify(settings),
        },
        auth,
        setAuth,
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return true;
    } catch (error) {
      console.error("Failed to update crossrate settings:", error.message);
      return false;
    }
  }
}

const crossRateService = new CrossRateService();
export default crossRateService;
