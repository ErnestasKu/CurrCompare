import { useContext, useEffect, useState } from "react";
import Dashboard from "./views/Dashboard";
import Header from "./views/Header";
import Historic from "./views/Historic";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CrossRates from "./views/CrossRates";
import Signup from "./views/Signup";
import Login from "./views/Login";
import { AuthContext } from "./AuthContext";
import authService from "./services/authenticationService";
import Profile from "./views/Profile";
import LoadingScreen from "./views/general/LoadingScreen";

function App() {
  const { auth, setAuth } = useContext(AuthContext);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        const response = await authService.refreshToken();

        if (response.ok) {
          const accessToken = await response.json();
          const tokenData = authService.formatTokenData(accessToken);
          setAuth(tokenData);
        } else {
          setAuth(null);
        }
      } catch (err) {
        // console.log("Auth check failed");
      } finally {
        setIsLoaded(true);
      }
    };

    if (!auth?.token) {
      verifyRefreshToken();
    } else {
      setIsLoaded(true);
    }
  }, []);

  if (!isLoaded) return <LoadingScreen />;

  return (
    <BrowserRouter>
      <div className="flex flex-col h-screen">
        <Header />

        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />

            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/historic" element={<Historic />} />
            <Route path="/crossrates" element={<CrossRates />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile/:id" element={<Profile />} />

            <Route
              path="*"
              element={
                <div className="p-10 text-center text-4xl">Page not found</div>
              }
            />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
