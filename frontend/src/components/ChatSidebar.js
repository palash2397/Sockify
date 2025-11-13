import React, { useState } from "react";

export default function ChatSidebar({ chats, onSelect, selectedChatId, onCreateChat }) {
  const [receiverId, setReceiverId] = useState("");

  const handleCreateChat = () => {
    if (receiverId.trim() === "") return;
    onCreateChat(receiverId);
    setReceiverId("");
  };

  return (
    <div className="w-1/3 bg-white border-r h-screen flex flex-col">
      <h2 className="p-4 font-semibold text-lg border-b">Chats</h2>

      {/* New Chat Section */}
      {/* hello */}
      <div className="p-3 border-b">
        <input
          className="border p-2 w-full rounded mb-2"
          placeholder="Enter user ID to start chat"
          value={receiverId}
          onChange={(e) => setReceiverId(e.target.value)}
        />
        <button
          onClick={handleCreateChat}
          className="bg-blue-500 text-white w-full py-1 rounded"
        >
          ➕ Start Chat
        </button>
      </div>

      {/* Existing Chats */}
      <div className="flex-1 overflow-y-auto">
        {chats.length === 0 && (
          <div className="text-center text-gray-400 mt-10">No chats yet</div>
        )}
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onSelect(chat.id)}
            className={`p-3 cursor-pointer border-b hover:bg-gray-100 ${
              selectedChatId === chat.id ? "bg-blue-50" : ""
            }`}
          >
            <div className="font-medium">
              {chat.name || `Chat ${chat.id}`}
            </div>
            <div className="text-xs text-gray-500 truncate">
              {chat.lastMessage?.content || "No messages yet"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
