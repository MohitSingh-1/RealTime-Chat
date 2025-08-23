import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { IoReorderThreeSharp } from "react-icons/io5";
import { allUsersRoute, host } from "../utils/APIRoutes";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";

export default function Chat() {
  const navigate = useNavigate();
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const storedUser = localStorage.getItem(import.meta.env.VITE_LOCALHOST_KEY);
      try {
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser) {
            setCurrentUser(parsedUser);
          } else {
            navigate("/login");
          }
        } else {
          navigate("/login");
        }
      } catch (err) {
        console.error("Failed to parse stored user:", err);
        localStorage.removeItem(import.meta.env.VITE_LOCALHOST_KEY);
        navigate("/login");
      }
    };
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchContacts = async () => {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
          setContacts(data.data);
        } else {
          navigate("/setAvatar");
        }
      }
    };
    fetchContacts();
  }, [currentUser]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
    setMenu(false); // Close sidebar after selecting contact on mobile
  };

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center bg-[#131324] relative">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between w-full px-4 py-3 bg-[#080420]">
        <h2 className="text-white text-lg font-bold">Snappy</h2>
        <div
          className="cursor-pointer"
          onClick={() => setMenu(!menu)}
        >
          <IoReorderThreeSharp className="text-white text-3xl" />
        </div>
      </div>

      {/* Chat Layout */}
      <div
        className="h-full w-full bg-black bg-opacity-40 grid 
        md:grid-cols-[20%_80%] rounded-lg overflow-hidden relative"
      >
        {/* Contacts Sidebar */}
        <div
          className={`fixed md:static top-0 left-0 h-full bg-[#080420] transition-transform duration-300 ease-in-out z-50
          ${menu ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:block w-[70%] sm:w-[40%] md:w-full`}
        >
          <Contacts
            contacts={contacts}
            changeChat={handleChatChange}
            menu={menu}
          />
        </div>

        {/* Overlay for mobile when sidebar is open */}

        {/* Chat Container */}
        <div className="h-full">
          {currentChat === undefined ? (
            <Welcome />
          ) : (
            <ChatContainer
              currentChat={currentChat}
              socket={socket}
              setMenu={setMenu}
              menu={menu}
            />
          )}
        </div>
      </div>
    </div>
  );
}
