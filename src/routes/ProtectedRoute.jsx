import React from "react";
import { Navigate } from "react-router-dom";
// import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({ children }) => {
//   const { user } = useAuth(); // hook بيرجع حالة المستخدم
//   if (!user) {
    return <Navigate to="/" replace />;
  }
//   return children;
// };

export default ProtectedRoute;
