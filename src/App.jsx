import { useState } from 'react'
import Login from "./Pages/Login"
import Chat from './Pages/Chat'
import { Routes, Route } from 'react-router-dom'
import SignUp from "./Pages/SignUp"
import SetAvatar from './components/SetAvatar'
function App() {

  return (
    <>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/setAvatar" element={<SetAvatar />} />
        <Route path="/" element={<Chat />} />
      </Routes>
    </>
  )
}

export default App
