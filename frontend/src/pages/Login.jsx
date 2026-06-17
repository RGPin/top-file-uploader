import { useState } from "react";
import { Link } from "react-router";

export default function Login() {
  const [formInput, setFormInput] = useState({ email: "", password: "" });

  function handleFormInput(e) {
    const { name, value } = e.target;
    setFormInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  return (
    <div className="login">
      <h2>Sign in to your account</h2>
      <form>
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
  );
}
