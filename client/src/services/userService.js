class UserService {
  // gets user info from id
  async getUserInfo(userId) {
    if (!userId) return null;

    const url = `${import.meta.env.VITE_URL}/api/User/${userId}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.warn(`User ${userId} not found.`);
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to fetch user info:", error.message);
      return null;
    }
  }
}

const userService = new UserService();
export default userService;
