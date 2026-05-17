import authService from "../services/authenticationService";

// fetch wrapper to deal with expired access tokens
export async function authFetch(url, options = {}, auth, setAuth) {
  if (!url || !auth || !setAuth) return null;

  let response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth.token}`,
    },
    credentials: "include",
  });

  // access token working
  if (response?.ok) return response;

  // if unauthorized (token expired)
  if (response?.status === 401) {
    // refresh token
    const refResponse = await authService.refreshToken();

    if (refResponse?.ok) {
      const accessToken = await refResponse.json();
      const tokenData = authService.formatTokenData(accessToken);
      setAuth(tokenData);

      // try again
      const newRes = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenData.token}`,
        },
        credentials: "include",
      });
      return newRes;
    }
    // else logout
    else {
      await authService.logout();
      setAuth(null);
      return null;
    }
    // either 200 or 500
  } else return response;
}
