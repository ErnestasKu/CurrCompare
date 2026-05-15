class DashboardService {
  // get user saved dashboard layout
  async get(userId, token) {
    if (!userId) return null;

    const url = `${import.meta.env.VITE_URL}/api/dashboard/settings/${userId}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to fetch dashboard settings:", error.message);
      return null;
    }
  }

  // update user saved dashboard layout
  async updateSettings(userId, settings, token) {
    if (!userId) return null;

    const url = `${import.meta.env.VITE_URL}/api/dashboard/settings/${userId}`;

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return true;
    } catch (error) {
      console.error("Failed to update dashboard settings:", error.message);
      return false;
    }
  }
}

const dashboardService = new DashboardService();
export default dashboardService;
