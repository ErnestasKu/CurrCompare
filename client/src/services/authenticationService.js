//https://localhost:7056/api/auth/register?Username=aaa&Password=bbb

export default class authenticationService {
  async register(username, email, password) {
    const params = new URLSearchParams();
    const queryString = params.toString();

    const url = `${import.meta.env.VITE_URL}/api/auth/register`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error(response);
        // const errorData = await response.json().catch(() => ({}));
        // throw new Error(
        //   errorData.message || `Server error: ${response.status}`,
        // );
      }
      return await response.json();
    } catch (error) {
      console.error("Registration failed:", error);
      return null;
    }
  }
}
