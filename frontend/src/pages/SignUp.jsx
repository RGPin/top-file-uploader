import { useState } from "react";
import { Link } from "react-router";

export default function SignUp() {
  const [formInput, setFormInput] = useState({
    name: "",
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

  return (
    <div className="signup">
      <div className="container">
        <h2>Create an account</h2>
        <form>
          <div className="form-field">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formInput.name}
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
