import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
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

 useEffect(() => {
  const fetchCurrentUser = async () => {
    const storedUser = localStorage.getItem(import.meta.env.VITE_LOCALHOST_KEY);
    console.log("Stored User String => ", storedUser);

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
      localStorage.removeItem(import.meta.env.VITE_LOCALHOST_KEY); // clean up bad data
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
  };

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center bg-[#131324]">
      <div
        className="h-full w-full bg-black bg-opacity-40 grid grid-cols-[25%_75%] 
        md:grid-cols-[20%_80%] rounded-lg overflow-hidden"
      >
        <Contacts contacts={contacts} changeChat={handleChatChange} />
        {currentChat === undefined ? (
          <Welcome />
        ) : (
          <ChatContainer currentChat={currentChat} socket={socket} />
        )}
      </div>
    </div>
  );
}
