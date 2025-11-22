import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";

const ProtectedRoute = ({ allowedRoles }) => {
  const user = useSelector((state) => state.account?.user);
  if (!allowedRoles.includes(user?.role)) {
    // Người dùng không có quyền, có thể điều hướng hoặc hiển thị trang lỗi
    return <Navigate to="/unauthorized" replace />;
  }
  if (!user) {
    // Nếu chưa đăng nhập thì điều hướng về trang login hoặc trang khác
    toast.error("Bạn chưa đăng nhập");
    return <Navigate to="/" replace />;
  }

  // Nếu có quyền thì render component bên trong
  return <Outlet />;
};

export default ProtectedRoute;
