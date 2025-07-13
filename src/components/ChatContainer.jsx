import React, { useState, useEffect, useRef } from "react";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
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
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, []);

  useEffect(() => {
    if (arrivalMessage) {
      setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="grid grid-rows-[10%,80%,10%] md:grid-rows-[15%,70%,15%] h-full w-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-2">
        <div className="flex items-center gap-4">
          <img
            src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
            alt="avatar"
            className="h-12"
          />
          <h3 className="text-white text-lg">{currentChat.username}</h3>
        </div>
        <Logout />
      </div>

      {/* Messages */}
      <div className="flex flex-col gap-4 px-6 py-4 overflow-y-auto custom-scrollbar">
        {messages.map((message) => (
          <div
            key={uuidv4()}
            ref={scrollRef}
            className={`flex ${
              message.fromSelf ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[40%] md:max-w-[70%] break-words p-4 text-base rounded-xl text-gray-200 ${
                message.fromSelf
                  ? "bg-[#4f04ff21]"
                  : "bg-[#9900ff20]"
              }`}
            >
              <p>{message.message}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <ChatInput handleSendMsg={handleSendMsg} />
    </div>
  );
}
