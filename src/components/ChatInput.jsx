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
    <div className="relative  w-full px-4 py-3 bg-[#0e0e2e]  border-l-2 border-gray-700">
      {/* Emoji Picker Popup */}
      {showEmojiPicker && (
        <div className="absolute bottom-16 left-4 z-50">
          <Picker onEmojiClick={handleEmojiClick} theme="dark" />
        </div>
      )}

      <form
        onSubmit={sendChat}
        className="w-full bg-[#1f1f3a] rounded-full flex items-center gap-3 px-4 py-2"
      >
        {/* Emoji Button */}
        <BsEmojiSmileFill
          onClick={handleEmojiPickerToggle}
          className="text-yellow-300 text-2xl cursor-pointer hover:scale-110 transition-transform"
        />

        {/* Text Input */}
        <input
          type="text"
          placeholder="Type your message here..."
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          className="flex-1 bg-transparent text-white placeholder-gray-400 text-sm sm:text-base focus:outline-none"
        />

        {/* Send Button */}
        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 cursor-pointer p-2 rounded-full transition-colors"
        >
          <IoMdSend className="text-white text-xl sm:text-2xl" />
        </button>
      </form>
    </div>
  );
}
