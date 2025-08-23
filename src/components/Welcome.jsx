import React, { useState, useEffect } from "react";
import Robot from "../assets/robot.gif";
import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const [userName, setUserName] = useState("");
  const key = import.meta.env.VITE_LOCALHOST_KEY;
  const navigate = useNavigate();


  useEffect(() => {
    console.log(key)
    if(key){
      const userData = JSON.parse(localStorage.getItem(key));
      setUserName(userData?.username || "");
    }
    else{
      navigate("/login");
    }
  }, []);

  return (
    <div className="flex h-full flex-col bg-indigo-900 items-center justify-center text-white text-center px-4">
      <img src={Robot} alt="robot" className="h-72 md:h-80" />
      <h1 className="text-2xl md:text-3xl font-semibold mt-4">
        Welcome, <span className="text-blue-400">{userName}!</span>
      </h1>
      <h3 className="text-sm md:text-base mt-2 text-gray-300">
        Please select a chat to start messaging.
      </h3>
    </div>
  );
}
