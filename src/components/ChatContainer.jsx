import React, { useState, useEffect, useRef } from "react";
import ChatInput from "./ChatInput";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute } from "../utils/APIRoutes";

export default function ChatContainer({ currentChat, socket }) {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);

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

    console.log("Socket available in ChatContainer");

    const handleReceiveMessage = (msg) => {
      console.log("Message received via socket:", msg);
      setArrivalMessage({ fromSelf: false, message: msg });
    };

    socket.current.on("msg-recieve", handleReceiveMessage);

    return () => {
      socket.current.off("msg-recieve", handleReceiveMessage);
    };
  }, [socket.current]);




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
      <div className="flex items-center justify-between px-6 py-2 h-[8%] bg-[#0e0e2e] border-l-2 border-gray-700">
        <div className="flex items-center gap-4">
          <img
            src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
            alt="avatar"
            className="h-12"
          />
          <h3 className="text-white text-lg">{currentChat.username}</h3>
        </div>
      </div>

      {/* Messages */}
      <div className="flex flex-col gap-4 px-6 py-4 overflow-y-auto custom-scrollbar h-[82%] bg-gradient-to-br from-indigo-700 via-purple-800 to-indigo-700">
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
