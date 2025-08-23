import React, { useState, useEffect, useRef } from "react";
import ChatInput from "./ChatInput";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute } from "../utils/APIRoutes";
import { IoReorderThreeSharp } from "react-icons/io5";
import Contacts from "./Contacts";

export default function ChatContainer({ currentChat, socket, setMenu, menu }) {
  
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);
const [screenHeight, setScreenHeight] = useState(window.innerHeight);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);


  useEffect(() => {
    const getMessages = async () => {
      const data = await JSON.parse(
        localStorage.getItem(import.meta.env.VITE_LOCALHOST_KEY)
      );
      const response = await axios.post(recieveMessageRoute, {
        from: data._id,
        to: currentChat._id,
      });
      setMessages(response.data);
    };
    if (currentChat) getMessages();
  }, [currentChat]);
  

  const handleSendMsg = async (msg) => {
    const data = await JSON.parse(
      localStorage.getItem(import.meta.env.VITE_LOCALHOST_KEY)
    );

    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: data._id,
      msg,
    });

    await axios.post(sendMessageRoute, {
      from: data._id,
      to: currentChat._id,
      message: msg,
    });

    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg });
    setMessages(msgs);
  };

  useEffect(() => {
    if (!socket.current) return;

    const handleReceiveMessage = ({ from, msg }) => {
      if (currentChat && currentChat._id === from) {
        setArrivalMessage({ fromSelf: false, message: msg });
      }
    };

    socket.current.on("msg-recieve", handleReceiveMessage);

    return () => {
      socket.current.off("msg-recieve", handleReceiveMessage);
    };
  }, [socket.current, currentChat]);




  useEffect(() => {
    if (arrivalMessage) {
      setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="relative flex flex-col h-full w-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center md:justify-between md:px-6 px-2 py-2 h-[8%] bg-[#0e0e2e] border-l-2 border-gray-700">
        {/* <div className="md:hidden pr-4" onClick={()=>{
          setMenu(!menu);
        }}>
          <IoReorderThreeSharp className="text-white text-3xl "/>
        </div> */}
        <div className="flex items-center gap-2">
          <img
            src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
            alt="avatar"
            className="h-9"
          />
          <h3 className="text-white text-lg">{currentChat.username}</h3>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex flex-col gap-4 px-6 pt-10 pb-20 overflow-y-auto custom-scrollbar bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900" style={{height:isMobile ? screenHeight - (screenHeight>700?160:screenHeight>600?170:170) : screenHeight - 120}}>
        {messages.map((message) => (
          <div
            key={uuidv4()}
            ref={scrollRef}
            className={`flex ${
              message.fromSelf ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`w-fit max-w-[80%] sm:max-w-[70%] break-words px-4 py-2 text-sm sm:text-base rounded-xl text-gray-200 ${
                message.fromSelf ? "bg-indigo-600" : "bg-indigo-800"
              }`}
            >
              <p>{message.message}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <div className="absolute bottom-0 w-full">
        <ChatInput handleSendMsg={handleSendMsg} />
      </div>
    </div>
  );
}