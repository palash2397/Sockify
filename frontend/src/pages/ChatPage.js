import React, { useEffect, useState } from "react";
import ChatSidebar from "../components/ChatSidebar";
import ChatRoom from "../components/ChatRoom";
import { connectSocket } from "../socket";
import { getChats } from "../api";
import axios from "axios";

export default function ChatPage({ token, userId }) {
  const [socket, setSocket] = useState(null);
  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);

  useEffect(() => {
    const s = connectSocket(token);
    s.on("connected", () => console.log("Socket connected ✅"));
    setSocket(s);

    // Load existing chats
    fetchChats();

    return () => s.disconnect();
  }, [token]);

  const fetchChats = async () => {
    try {
      const res = await getChats(token);
      setChats(res.data.chats || []);
    } catch (err) {
      console.error("Error fetching chats:", err);
    }
  };

  const handleCreateChat = async (receiverId) => {
    try {
      const res = await axios.post(
        `http://localhost:3001/chat/${receiverId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        alert(`✅ Chat created with user ID ${receiverId}`);
        fetchChats(); // refresh chat list
      }
    } catch (error) {
      console.error("Error creating chat:", error);
      alert("Failed to create chat. Check receiver ID or backend.");
    }
  };

  return (
    <div className="flex">
      <ChatSidebar
        chats={chats}
        onSelect={setSelectedChatId}
        selectedChatId={selectedChatId}
        onCreateChat={handleCreateChat}
      />
      {selectedChatId && socket ? (
        <ChatRoom
          socket={socket}
          chatId={selectedChatId}
          token={token}
          userId={userId}
        />
      ) : (
        <div className="w-2/3 flex items-center justify-center text-gray-500">
          Select a chat to start messaging
        </div>
      )}
    </div>
  );
}
