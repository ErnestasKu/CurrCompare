//https://localhost:7056/api/auth/register?Username=aaa&Password=bbb

export default class authenticationService {
  async register(username, email, password) {
    const params = new URLSearchParams();
    const queryString = params.toString();

    const url = `${import.meta.env.VITE_URL}/api/auth/register`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Username: username,
        Email: email,
        Password: password,
      }),
    });

    return response;
  }

  decodeJwt(tokenString) {
    if (!tokenString) return null;

    try {
      const payload = tokenString.split(".")[1];
      const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
      return JSON.parse(atob(base64));
    } catch (error) {
      console.error("Failed to decode JWT:", error);
      return null;
    }
  }
}
