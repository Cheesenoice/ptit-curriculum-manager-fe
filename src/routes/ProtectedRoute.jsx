// src/routes/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const token = localStorage.getItem("access_token");
  const user = JSON.parse(localStorage.getItem("user"));

  // Chưa đăng nhập → về login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Không có role phù hợp → về trang chủ
  if (!allowedRoles.includes(user.roles)) {
    return <Navigate to="/" replace />;
  }

  // Hợp lệ → render component con
  return children;
};

export default ProtectedRoute;
