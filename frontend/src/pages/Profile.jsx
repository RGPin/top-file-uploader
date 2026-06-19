import { Navigate } from "react-router";
import { useAuthStore } from "../store/useAuthStore";

export default function Profile() {
  const { user } = useAuthStore();

  return (
    <div className="profile">
      <div className="container">
        <h2>Profile</h2>
        <div className="details">
          <div className="detail-container">
            Name
            <p className="detail username">{user.username}</p>
          </div>
          <div className="detail-container">
            Email
            <p className="detail email">{user.email}</p>
          </div>
        </div>
        <button>Delete Account</button>
      </div>
    </div>
  );
}
