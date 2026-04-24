import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authenticationService from "../services/authenticationService";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.passwordConfirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      const auth = new authenticationService();
      const response = await auth.register(formData.username, formData.email, formData.password);

      if (response.ok) {
        navigate("/login");
      } else {
        const data = await response.json();
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Could not connect to the server");
    }
  };

  return (
    <div className="page-default flex flex-col justify-center items-center min-h-[80vh]">
      <form
        onSubmit={handleSubmit}
        className="bubble flex flex-col gap-4 w-md shadow-2xl"
      >
        <div className="text-center text-4xl font-bold text-primary mb-4">
          Log in
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
          <label className="page-label text-xl">Password</label>
          <input
            required
            name="password"
            type="password"
            className="page-select-field"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="mt-2 bg-primary hover:bg-primary-hover text-bg-main font-bold p-3 rounded-xl shadow-md shadow-black"
        >
          Sign Up
        </button>

        <p className="text-center text-txt-dark">
          Don't have an account?
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="text-primary hover:text-primary-hover font-semibold ms-1"
          >
            Sign up!
          </button>
        </p>
      </form>
    </div>
  );
}
