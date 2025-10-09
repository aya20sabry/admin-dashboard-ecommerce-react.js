import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../store/slices/authSlice';
import axiosInstance from '../../Api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/user/login', { email, password });
      const { token, userName, email: userEmail, role } = response.data.data; // ✅ لاحظي التعديل هنا

      // خزني البيانات في الـ store و localStorage
      dispatch(loginSuccess({ user: { userName, email: userEmail, role }, token }));
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ userName, email: userEmail, role }));

      // توجيه حسب الدور
      const userRole = role?.toLowerCase();

      if (userRole === 'admin') {
        Swal.fire({
            icon: 'success',
            title: 'login successfuly',
          }).then(()=>{
            navigate('/admin/dashboard');

          })
      } else if (userRole === 'seller') {
        Swal.fire({
            icon: 'success',
            title: 'login successfuly',
          }).then(()=>{
            navigate('/seller');

          })
      } else {
        Swal.fire({
            icon: 'success',
            title: 'login successfuly',
        });
        navigate('/login');
      }
      


    } catch (err) {
      console.error(err.response?.data || err.message);
     
    //   alert(err.response?.data?.message || 'Invalid email or password');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded-2xl shadow-md w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
