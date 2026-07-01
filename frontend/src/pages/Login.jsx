import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuthStore } from "../store/useAuthStore";

export default function Login() {
  const { handleLogin, isLoggingIn, user } = useAuthStore();
  const [formInput, setFormInput] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  function handleFormInput(e) {
    const { name, value } = e.target;
    setFormInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!formInput.email || !formInput.password) return;
    handleLogin(formInput, () => {
      navigate("/files/default");
    });
  }

  if (isLoggingIn) {
    return <div className="loading">Checking credentials...</div>;
  }

  return (
    <div className="login">
      <div className="container">
        <h2>Sign in to your account</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formInput.email}
              onChange={handleFormInput}
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formInput.password}
              onChange={handleFormInput}
            />
          </div>

          <button type="submit">Sign In</button>
        </form>
        <p>
          Don't have an account? <Link to="/signup">Create Account</Link>
        </p>
      </div>
    </div>
  );
}
