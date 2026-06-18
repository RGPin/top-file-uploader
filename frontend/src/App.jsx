import { useState } from "react";
import "./App.css";
import { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import Files from "./pages/Files";
import Header from "./components/Header";
import { useAuthStore } from "./store/useAuthStore";

function App() {
  const { user, isFetchingUser, fetchUser } = useAuthStore();

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    fetchUser(signal);
    return () => controller.abort();
  }, [fetchUser]);

  if (isFetchingUser) {
    return <div className="loading">Loading your workspace...</div>;
  }

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/signup"
          element={!user ? <SignUp /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/profile"
          element={user ? <Profile /> : <Navigate to="/login" />}
        ></Route>
        <Route
          path="/"
          element={user ? <Files /> : <Navigate to="/login" />}
        ></Route>
      </Routes>
    </div>
  );
}

export default App;
