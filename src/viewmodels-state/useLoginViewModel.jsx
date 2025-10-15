// src/viewmodels/useLoginViewModel.js
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { loginApi } from "../Api/loginApi";
import { loginSuccess } from "../store/slices/authSlice";

export const useLoginViewModel = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await loginApi(email, password);

      dispatch(loginSuccess({ user, token: user.token }));
      localStorage.setItem("token", user.token);
      localStorage.setItem("user", JSON.stringify(user));

      Swal.fire({
        icon: "success",
        title: "Login Successfully!",
        showConfirmButton: false,
        timer: 1500,
      });

      const role = user.role?.toLowerCase();
      if (role === "admin") navigate("/admin/dashboard");
      else if (role === "seller") navigate("/seller");
      else navigate("/");
    } catch {
      Swal.fire({
        icon: "error",
        title: "Invalid email or password",
      });
    }
  };

  return {
    email,
    password,
    setEmail,
    setPassword,
    handleLogin,
  };
};
