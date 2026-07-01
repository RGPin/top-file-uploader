import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router";

export default function Header() {
  const { user, handleLogOut } = useAuthStore();
  return (
    <div className="header">
      <h1>STORAGEAPP</h1>
      {user ? (
        <div className="actions">
          <Link to="/profile" className="link">
            Profile
          </Link>
          <Link to="/files/default" className="link">
            Files
          </Link>
          <button onClick={handleLogOut}>Log Out</button>
        </div>
      ) : (
        <div className="actions">
          <Link to="/login" className="link">
            Login
          </Link>
          <Link to="/signup" className="link">
            Sign Up
          </Link>
        </div>
      )}
    </div>
  );
}
