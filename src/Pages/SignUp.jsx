import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/logo.svg";
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { signupRoute } from "../utils/APIRoutes";



export default function SignUp() {
  const navigate = useNavigate();


  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (localStorage.getItem(import.meta.env.VITE_LOCALHOST_KEY)) {
      navigate("/");
    }
  }, []);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleValidation = () => {
    const { password, confirmPassword, username, email } = formData;
    if (password !== confirmPassword) {
      toast.error("Password and confirm password should be same.");
      return false;
    } else if (username.length < 3) {
      toast.error("Username should be greater than 3 characters.");
      return false;
    } else if (password.length < 8) {
      toast.error("Password should be equal or greater than 8 characters.");
      return false;
    } else if (email === "") {
      toast.error("Email is required.");
      return false;
    }
    return true;
  };

   const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { email, username, password } = formData;
      const { data } = await axios.post(signupRoute, {
        username,
        email,
        password,
      });
      console.log(data);
      if (data.status === false) {
        console.log("false me haii");
        toast.error(data.msg);
      }
      if (data.status === true) {
        toast.success(data.msg)
        navigate("/login");
      }
    }
  };

  return (
    <>
      <div className="min-h-screen w-full bg-[#131324] flex items-center justify-center px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-black bg-opacity-60 backdrop-blur-md px-6 py-8 sm:px-10 sm:py-12 rounded-2xl flex flex-col gap-6 w-[90vw] max-w-md"
        >
          <div className="flex items-center justify-center gap-4 mb-2">
            <img src={Logo} alt="logo" className="md:h-20 h-10" />
            <h1 className=" text-lg md:text-2xl text-white uppercase font-bold tracking-wider">
              Snappy
            </h1>
          </div>

          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={handleChange}
            className="bg-transparent border border-indigo-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-gray-400"
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={handleChange}
            className="bg-transparent border border-indigo-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-gray-400"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleChange}
            className="bg-transparent border border-indigo-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-gray-400"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            onChange={handleChange}
            className="bg-transparent border border-indigo-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-gray-400"
          />

          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-semibold uppercase"
          >
            Create User
          </button>

          <span className="text-white text-center text-sm uppercase">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-400 font-bold underline">
              Login.
            </Link>
          </span>
        </form>
      </div>
    </>
  );
}
