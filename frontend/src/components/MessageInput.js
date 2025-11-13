import React, { useState } from "react";

export default function MessageInput({ onSend, onTyping }) {
  const [text, setText] = useState("");

  const handleKeyDown = (e) => {
    onTyping();
    if (e.key === "Enter" && text.trim()) {
      onSend(text);
      setText("");
    }
  };

  return (
    <div className="p-3 border-t bg-white">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full border p-2 rounded"
        placeholder="Type a message..."
      />
    </div>
  );
}
