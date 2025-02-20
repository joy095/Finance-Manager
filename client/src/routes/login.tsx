/** @format */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../services/api";
import { useDispatch } from "react-redux";
import { setCredentials as setAuthCredentials } from "../store/authSlice";

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

interface Credentials {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [formData, setFormData] = useState<Credentials>({
    email: "",
    password: "",
  });

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await login(formData).unwrap();
      const { accessToken, refreshToken } = response as LoginResponse;

      dispatch(
        setAuthCredentials({
          accessToken,
          refreshToken,
        })
      );

      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              data-test="email-input"
              value={formData.email}
              autoComplete="email"
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border text-black border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              data-test="password-input"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border text-black border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            data-test="login-button"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
          <div className="text-center">
            <button
              type="button"
              data-test="register-link"
              className="text-green-600 hover:underline"
              onClick={() => navigate("/register")}
            >
              Don't have an account? Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
