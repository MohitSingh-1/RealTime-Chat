import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginRoute } from "../utils/APIRoutes";
import { FaHandsClapping } from "react-icons/fa6";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });

  const toastOptions = {
    position: "top-right",
    autoClose: 8000,
    pauseOnHover: false,
    draggable: true,
    theme: "dark",
  };


  useEffect(() => {
    if (localStorage.getItem(import.meta.env.VITE_LOCALHOST_KEY)) {
      navigate("/");
    }
  }, []);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const validateForm = () => {
    const { username, password } = formData;
    if (username === "" || password === "") {
      toast.error("Email and Password is required.", toastOptions);
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      const { username, password } = formData;
      const res = await axios.post(loginRoute, {
        username,
        password,
      });
      if (!res || res.data.status === false) {
        toast.error(res.data.msg, toastOptions);
      }
      
      if (res.data.status === true) {
        toast.success("Logged in",toastOptions);
        localStorage.setItem(
            import.meta.env.VITE_LOCALHOST_KEY,
            JSON.stringify(res.data.user)
        );
        navigate("/signup");
      }
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-[#131324]  px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-black bg-opacity-60 backdrop-blur-md p-8 sm:p-12 rounded-2xl flex flex-col gap-6 w-full max-w-md shadow-lg"
        >
          <div className="flex items-center justify-center gap-4 mb-2">
            <img src={Logo} alt="logo" className="h-20" />
            <h1 className="text-2xl text-white uppercase font-bold tracking-wider">
              Snappy
            </h1>
          </div>

          <div className="text-indigo-500 font-bold text-xl flex flex-row gap-3 items-center">
            Welcome back! <FaHandsClapping className="text-purple-300"/>
          </div>

          <input
            type="text"
            placeholder="Username"
            name="username"
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

          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 hover:scale-95 transition-all duration-200 cursor-pointer text-white py-2 rounded-md font-semibold uppercase"
          >
            Log In
          </button>

          <span className="text-white text-center text-sm uppercase">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="text-indigo-400 font-bold underline">
              Create One.
            </Link>
          </span>
        </form>
      </div>
      <ToastContainer />
    </>
  );
}
