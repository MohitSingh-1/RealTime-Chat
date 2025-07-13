import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Buffer } from "buffer";
import multiavatar from "@multiavatar/multiavatar/esm";
import "react-toastify/dist/ReactToastify.css";
import loader from "../assets/loader.gif";
import { setAvatarRoute } from "../utils/APIRoutes";

export default function SetAvatar() {
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem(import.meta.env.VITE_LOCALHOST_KEY);
    if (!isLoggedIn) navigate("/login");
  }, []);

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar", toastOptions);
    } else {
      const user = JSON.parse(localStorage.getItem(import.meta.env.VITE_LOCALHOST_KEY));
      const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
        image: avatars[selectedAvatar],
      });

      if (data.isSet) {
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem(import.meta.env.VITE_LOCALHOST_KEY, JSON.stringify(user));
        navigate("/");
      } else {
        toast.error("Error setting avatar. Please try again.", toastOptions);
      }
    }
  };

  useEffect(() => {
    const loadAvatars = async () => {
      const data = [];
      for (let i = 0; i < 4; i++) {
        const svg = multiavatar(Math.round(Math.random() * 1000));
        const base64 = btoa(unescape(encodeURIComponent(svg)));
        data.push(base64);
      }
      setAvatars(data);
      setIsLoading(false);
    };
    loadAvatars();
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="h-screen w-screen bg-[#131324] flex justify-center items-center">
          <img src={loader} alt="loader" className="w-32" />
        </div>
      ) : (
        <div className="h-screen w-screen bg-[#131324] flex flex-col items-center justify-center gap-12 px-4">
          <div className="text-white text-center">
            <h1 className="text-2xl md:text-3xl font-semibold">
              Pick an Avatar as your profile picture
            </h1>
          </div>
          <div className="flex gap-6 flex-wrap justify-center items-center">
            {avatars.map((avatar, index) => (
              <div
                key={index}
                onClick={() => setSelectedAvatar(index)}
                className={`p-2 rounded-full cursor-pointer transition-all duration-300 border-4 ${
                  selectedAvatar === index ? "border-indigo-500" : "border-transparent"
                }`}
              >
                <img
                  src={`data:image/svg+xml;base64,${avatar}`}
                  alt="avatar"
                  className="h-24 transition-all duration-300"
                />
              </div>
            ))}
          </div>
          <button
            onClick={setProfilePicture}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-md uppercase tracking-wider transition"
          >
            Set as Profile Picture
          </button>
          <ToastContainer />
        </div>
      )}
    </>
  );
}
