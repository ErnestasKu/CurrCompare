let memoizedToken = null;

class AuthenticationService {
  async register(username, email, password) {
    const url = `${import.meta.env.VITE_URL}/api/auth/register`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Username: username,
        Email: email,
        Password: password,
      }),
      credentials: "include",
    });

    return response;
  }

  async login(email, password) {
    const url = `${import.meta.env.VITE_URL}/api/auth/login`;

    return await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Email: email,
        Password: password,
      }),
      credentials: "include",
    });
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

  async refreshToken() {
    if (memoizedToken) {
      return memoizedToken;
    }

    const url = `${import.meta.env.VITE_URL}/api/auth/refresh-token`;
    try {
      memoizedToken = fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const response = await memoizedToken;
      return response;
    } finally {
      memoizedToken = null;
    }
  }

  formatTokenData(rawToken) {
    if (!rawToken || !rawToken.accessToken) return null;

    const decodedJWT = this.decodeJwt(rawToken.accessToken);

    return {
      token: rawToken.accessToken,
      id: decodedJWT.id,
      username: decodedJWT.username,
      role: decodedJWT.role,
    };
  }

  async logout() {
    const url = `${import.meta.env.VITE_URL}/api/auth/logout`;
    return await fetch(url, {
      method: "POST",
      credentials: "include",
    });
  }
}

const authService = new AuthenticationService();
export default authService;
