import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuthStore } from "../store/useAuthStore";

export default function SignUp() {
  const { handleSignUp } = useAuthStore();
  const navigate = useNavigate();
  const [formInput, setFormInput] = useState({
    username: "",
    email: "",
    password: "",
  });

  function handleFormInput(e) {
    const { name, value } = e.target;
    setFormInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!formInput.email || !formInput.password || !formInput.username) return;
    handleSignUp(formInput, () => {
      navigate("/login");
    });
  }

  return (
    <div className="signup">
      <div className="container">
        <h2>Create an account</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="username">Name</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formInput.username}
              onChange={handleFormInput}
            />
          </div>

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
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
