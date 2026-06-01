import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import authService from "../services/authenticationService";

export default function Signup() {
  const { setAuth } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [error, setError] = useState("");
  const trimmedUsername = formData.username.trim();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // on success, create account, log in and go to dashboard
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.passwordConfirm) {
      setError("Passwords do not match");
      return;
    }

    if (trimmedUsername.length < 3) {
      setError("Username must be at least 3 characters (excluding spaces)");
      return;
    }

    try {
      setLoading(true);
      const response = await authService.register(
        trimmedUsername,
        formData.email,
        formData.password,
      );

      if (response.ok) {
        const accessToken = await response.json();
        const tokenData = authService.formatTokenData(accessToken);
        setAuth(tokenData);

        navigate("/dashboard");
      } else {
        const errorText = await response.text();
        setError(errorText || "Registration failed");
      }
    } catch (err) {
      setError("Could not connect to the server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-default flex flex-col justify-center items-center min-h-[80vh]">
      <form
        onSubmit={handleSubmit}
        className="bubble flex flex-col gap-4 w-md shadow-2xl"
      >
        <div className="text-center text-4xl font-bold text-primary mb-4">
          Sign up
        </div>

        <div className="bg-primary h-0.5"></div>

        {error && (
          <div className="bg-bad/10 border border-bad/50 text-bad p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="page-label text-xl">Email</label>
          <input
            required
            name="email"
            type="email"
            className="page-select-field"
            placeholder="Enter your email address"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="page-label text-xl">Username</label>
          <input
            required
            autoComplete="username"
            name="username"
            type="text"
            minLength={3}
            maxLength={30}
            className="page-select-field"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="page-label text-xl">Password</label>
          <input
            required
            autoComplete="new-password"
            name="password"
            type="password"
            minLength={6}
            className="page-select-field"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="page-label text-xl">Confirm Password</label>
          <input
            required
            name="passwordConfirm"
            type="password"
            minLength={6}
            className="page-select-field w-full"
            placeholder="Verify your password"
            value={formData.passwordConfirm}
            onChange={handleChange}
          />
        </div>

        <button
          disabled={loading}
          type="submit"
          className="mt-2 bg-primary hover:bg-primary-hover disabled:bg-primary-hover text-bg-main font-bold p-3 rounded-xl shadow-md shadow-black"
        >
          Continue
        </button>

        <p className="text-center text-txt-dark">
          Already have an account?
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-primary hover:text-primary-hover font-semibold ms-1"
          >
            Log in!
          </button>
        </p>
      </form>
    </div>
  );
}
