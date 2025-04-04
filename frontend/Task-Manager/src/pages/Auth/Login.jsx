import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/layouts/AuthLayout';
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Clear previous errors before submitting
    setError(null);

    // Validate input
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 4) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    console.log('Logging in with:', email, password);

    
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN+`?email=${email}&password=${password}`);
      const { token, role, user } = response.data;
      console.log(token, role, user)
      if (token) {
        localStorage.setItem("token", token);
        // updateUser(user); // Store user in context
        console.log('user set')
        console.log(token)
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else {
          console.log('/user/dashboard');
          navigate("/user/dashboard");
        }
      } else {
        setError("Invalid login details. Please try again.");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong, please try again later.");
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Welcome Back</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Please enter your details to log in
        </p>

        <form onSubmit={handleLogin}>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Emaill"
            type="text"
            className="w-full p-3 bg-gray-200 rounded-[12px] mb-3 focus:outline-none"
            required
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-gray-200 rounded-[12px] focus:outline-none mb-2"
            required
          />

          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <button type="submit" className="w-full text-sm font-medium text-white bg-blue-500 shadow-purple-600/5 p-2 rounded-md my-1 hover:bg-blue-300 hover:text-blue-800 cursor-pointer">
            LOGIN
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            Don't have an account?{" "}
            <Link to="/signup" className="font-medium text-primary underline">
              Signup
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}

export default Login;



////

