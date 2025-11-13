import React, { useEffect, useState } from "react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { sendMessage, getMessages } from "../api";

export default function ChatRoom({ socket, chatId, token, userId }) {
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (!chatId) return;
    getMessages(chatId, token).then((res) => setMessages(res.data.messages || []));
    socket.emit("joinChat", chatId);
  }, [chatId]);

  useEffect(() => {
    socket.on("messageReceived", (msg) => {
      if (msg.chatId === Number(chatId)) setMessages((prev) => [...prev, msg]);
    });
    socket.on("typing", (id) => {
      if (Number(id) === Number(chatId)) {
        setTyping(true);
        setTimeout(() => setTyping(false), 2000);
      }
    });
    return () => {
      socket.off("messageReceived");
      socket.off("typing");
    };
  }, [chatId]);

  const handleSend = async (text) => {
    const res = await sendMessage(chatId, text, token);
    setMessages((prev) => [...prev, res.data.message]);
  };

  return (
    <div className="flex flex-col h-screen w-2/3">
      <MessageList messages={messages} currentUserId={userId} />
      {typing && <div className="text-xs text-gray-500 px-4">Someone is typing...</div>}
      <MessageInput onSend={handleSend} onTyping={() => socket.emit("typing", chatId)} />
    </div>
  );
}
