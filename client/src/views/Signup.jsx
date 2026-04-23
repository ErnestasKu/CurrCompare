import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
    // role: "User",
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
      const response = await fetch("https://localhost:5001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          role: formData.role,
        }),
      });

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
          Sign up
        </div>

        <div className="bg-primary h-0.5"></div>

        {error && (
          <div className="bg-bad/10 border border-bad/50 text-bad p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="page-label text-xl">Username</label>
          <input
            required
            name="username"
            type="text"
            className="page-select-field"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="page-label text-xl">Email Address</label>
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
            className="page-select-field w-full"
            placeholder="Verify your password"
            value={formData.passwordConfirm}
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
          Already have an account?
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-primary hover:text-primary-hover font-semibold ms-1"
          >
            Log in
          </button>
        </p>
      </form>
    </div>
  );
}
