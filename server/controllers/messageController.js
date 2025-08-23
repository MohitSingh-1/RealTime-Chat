import Message from "../models/messageModel.js";
import { encrypt, decrypt } from "../utils/crypto.js";




export const addMessage = async (req, res) => {
try {
    const { from, to, message, chatId } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ msg: "Message is required" });
    }

    const encryptedMsg = encrypt(message);

    const data = await Message.create({
      message: { text: encryptedMsg }, 
      users: [from, to],
      sender: from,
      chat: chatId || null,
    });

    return res.status(201).json({ msg: "Message sent successfully", data });
  } catch (err) {
    console.error("Error sending message:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get All Messages (Decrypt Before Return)
export const getMessages = async (req, res) => {
 try {
    const { from, to } = req.body;

    const messages = await Message.find({
      users: { $all: [from, to] },
    }).sort({ updatedAt: 1 });
    
    const decryptedMessages = messages.map((msg) => ({
      fromSelf: msg.sender.toString() === from,
      message: decrypt(msg.message.text),      createdAt: msg.createdAt,
    }));

    res.json(decryptedMessages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};