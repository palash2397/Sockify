import React, { useState } from "react";
import ChatPage from "./pages/ChatPage";

function App() {
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [ready, setReady] = useState(false);

  if (!ready)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-6 rounded shadow-md w-80">
          <h2 className="text-lg font-semibold mb-4 text-center">Login</h2>
          <input
            className="border p-2 w-full mb-2 rounded"
            placeholder="JWT Token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <input
            className="border p-2 w-full mb-4 rounded"
            placeholder="Your User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <button
            onClick={() => setReady(true)}
            className="bg-blue-500 text-white p-2 w-full rounded"
          >
            Enter Chat
          </button>
        </div>
      </div>
    );

  return <ChatPage token={token} userId={Number(userId)} />;
}

export default App;
