import React, { useEffect, useRef } from "react";

export default function MessageList({ messages, currentUserId }) {
  const endRef = useRef();
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
      {messages.map((msg, i) => (
        <div key={i} className={`my-2 flex ${msg.senderId === currentUserId ? "justify-end" : "justify-start"}`}>
          <div
            className={`px-3 py-2 rounded-lg max-w-xs ${
              msg.senderId === currentUserId ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {msg.content}
          </div>
        </div>
      ))}
      <div ref={endRef}></div>
    </div>
  );
}
