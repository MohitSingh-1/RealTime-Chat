import React from "react";
import { useNavigate } from "react-router-dom";
import { BiPowerOff } from "react-icons/bi";
import axios from "axios";
import { logoutRoute } from "../utils/APIRoutes";
import { LuLogOut } from "react-icons/lu";

export default function Logout() {
  const navigate = useNavigate();

  const handleClick = async () => {
    const id = JSON.parse(localStorage.getItem(import.meta.env.VITE_LOCALHOST_KEY))._id;
    const data = await axios.get(`${logoutRoute}/${id}`);
    if (data.status === 200) {
      localStorage.clear();
      navigate("/login");
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex justify-center items-center p-2 rounded-md bg-red-400 border-none cursor-pointer hover:bg-red-500 hover:scale-105 transition-all duration-200"
    >
      <LuLogOut className="text-[1.3rem] text-[#ebe7ff]" />
    </button>
  );
}
