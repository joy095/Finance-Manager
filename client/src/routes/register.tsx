/** @format */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../services/api";
import * as yup from "yup";

interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

const validationSchema = yup.object().shape({
  username: yup.string().min(3).max(50).required("Username is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6).required("Password is required"),
});

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [register, { isLoading, isSuccess, isError, error }] =
    useRegisterMutation();
  const [formErrors, setFormErrors] = useState<Partial<RegisterCredentials>>(
    {}
  );
  const [credentials, setCredentials] = useState<RegisterCredentials>({
    username: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (isSuccess) {
      navigate("/dashboard");
    }
  }, [isSuccess, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await validationSchema.validate(credentials, { abortEarly: false });
      await register(credentials).unwrap();
      alert("Registered successfully");
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const errors: Partial<RegisterCredentials> = {};
        error.inner.forEach((err) => {
          if (err.path) {
            errors[err.path as keyof RegisterCredentials] = err.message;
          }
        });
        setFormErrors(errors);
      } else {
        console.error("Registration error:", error);
        if (typeof error === "object" && error !== null && "data" in error) {
          alert(
            (error as { data?: { message?: string } }).data?.message ??
              "Registration failed"
          );
        } else {
          alert("Registration failed");
        }
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-4">Register</h2>
        {isError && (
          <p className="text-red-500 text-center">
            {(error as { data?: { message?: string } })?.data?.message ??
              "Registration failed"}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={credentials.username}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border text-black border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {formErrors.username && (
              <p className="text-red-500 text-sm mt-1">{formErrors.username}</p>
            )}
          </div>
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
              value={credentials.email}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border text-black border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {formErrors.email && (
              <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
            )}
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
              autoComplete="current-password"
              value={credentials.password}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border text-black border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {formErrors.password && (
              <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
          <div className="text-center">
            <button
              type="button"
              className="text-green-600 hover:underline"
              onClick={() => navigate("/login")}
            >
              Already have an account? Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
