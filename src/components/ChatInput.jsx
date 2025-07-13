import React, { useState } from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import Picker from "emoji-picker-react";

export default function ChatInput({ handleSendMsg }) {
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiPickerToggle = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (emojiData) => {
    setMsg((prev) => prev + emojiData.emoji);
  };

  const sendChat = (event) => {
    event.preventDefault();
    if (msg.trim().length > 0) {
      handleSendMsg(msg);
      setMsg("");
    }
  };

  return (
    <div className="grid grid-cols-[5%,95%] items-center bg-[#080420] px-8 py-4 gap-4">
      {/* Emoji Button */}
      <div className="relative text-white">
        <BsEmojiSmileFill
          className="text-yellow-300 text-2xl cursor-pointer"
          onClick={handleEmojiPickerToggle}
        />
        {showEmojiPicker && (
          <div className="absolute bottom-16 z-10">
            <Picker onEmojiClick={handleEmojiClick} theme="dark" />
          </div>
        )}
      </div>

      {/* Message Input */}
      <form
        onSubmit={sendChat}
        className="flex items-center w-full gap-4 bg-white/20 rounded-full px-4 py-2"
      >
        <input
          type="text"
          placeholder="Type your message here"
          className="w-full bg-transparent text-white placeholder-white text-lg focus:outline-none"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />
        <button
          type="submit"
          className="bg-purple-500 p-2 rounded-full flex justify-center items-center"
        >
          <IoMdSend className="text-white text-2xl" />
        </button>
      </form>
    </div>
  );
}
