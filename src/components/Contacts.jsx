import React, { useEffect, useState } from "react";
import Logo from "../assets/logo.svg";
import Logout from "../components/Logout";

export default function Contacts({ contacts, changeChat }) {
  const [currentUserName, setCurrentUserName] = useState();
  const [currentUserImage, setCurrentUserImage] = useState();
  const [currentSelected, setCurrentSelected] = useState();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(import.meta.env.VITE_LOCALHOST_KEY));
    setCurrentUserName(data?.username);
    setCurrentUserImage(data?.avatarImage);
  }, []);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  return (
    <>
      {currentUserImage && currentUserName && (
        <div className="grid grid-rows-[8%_1fr_8%] bg-[#080420] h-full overflow-hidden">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 py-1">
            <img src={Logo} alt="logo" className="h-5 w-5" />
            <h3 className="text-white text-sm font-bold tracking-wide uppercase">Snappy</h3>
          </div>

          {/* Contacts List */}
          <div className="overflow-y-auto px-2 flex flex-col gap-1 scrollbar-thin scrollbar-thumb-purple-500 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]">
            {contacts.map((contact, index) => (
              <div
                key={contact._id}
                className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-all duration-300 ${
                  index === currentSelected
                    ? "bg-purple-500"
                    : "bg-white/10 hover:bg-white/20"
                }`}
                onClick={() => changeCurrentChat(index, contact)}
              >
                <img
                  src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                  alt="avatar"
                  className="h-8 w-8"
                />
                <h3 className="text-white text-sm truncate">{contact.username}</h3>
              </div>
            ))}
          </div>

          {/* Current User */}
          <div className="flex flex-row justify-between bg-[#0d0d30] px-4">
            <div className="flex items-center justify-center gap-2 px-2 py-2">
              <img
                src={`data:image/svg+xml;base64,${currentUserImage}`}
                alt="avatar"
                className="h-8 w-8"
              />
              <h2 className="text-white text-xs font-medium truncate">{currentUserName}</h2>
            </div>
            <div className=" items-center flex justify-center">
              <Logout/>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
