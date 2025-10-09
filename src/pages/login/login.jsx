import React, { useState } from "react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/slices/authSlice";
import axiosInstance from "../../Api/axiosInstance";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/user/login", { email, password });
      const { token, userName, email: userEmail, role } = response.data.data;

      dispatch(loginSuccess({ user: { userName, email: userEmail, role }, token }));
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({ userName, email: userEmail, role }));

      Swal.fire({
        icon: "success",
        title: "Login Successfully!",
        showConfirmButton: false,
        timer: 1500,
      });

      const userRole = role?.toLowerCase();
      if (userRole === "admin") navigate("/admin/dashboard");
      else if (userRole === "seller") navigate("/seller");
      else navigate("/");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Invalid email or password",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="bg-gray-900/60 backdrop-blur-lg border border-gray-700 rounded-3xl shadow-2xl p-10 w-[420px] text-white"
      >
        {/* Animation for Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="text-4xl font-extrabold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
        >
          Welcome Back 
        </motion.h2>

        <form onSubmit={handleLogin} className="space-y-5">
          <motion.input
            whileFocus={{ scale: 1.03 }}
            type="email"
            placeholder="Email Address"
            className="w-full bg-gray-800 text-white placeholder-gray-400 border border-gray-700 rounded-xl px-5 py-3 text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <motion.input
            whileFocus={{ scale: 1.03 }}
            type="password"
            placeholder="Password"
            className="w-full bg-gray-800 text-white placeholder-gray-400 border border-gray-700 rounded-xl px-5 py-3 text-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2 }}
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 text-white text-lg font-semibold py-3 rounded-xl shadow-md transition"
          >
            Login
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
