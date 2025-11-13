# 🗨️ Sockify — Real-Time Chat Application

Sockify is a modern full-stack **real-time chat platform** built using **Node.js**, **Express**, **Socket.IO**, **Prisma ORM**, **MySQL**, and **React**.  
It supports instant messaging, typing indicators, presence status, and a clean real-time architecture.

---

## 🚀 Features

- 🔐 **JWT Authentication**
- 💬 **One-to-One Chats**
- ⚡ **Real-Time Messaging using Socket.IO**
- 🟢 **Online/Offline Presence Tracking**
- ✍️ **Typing Indicators in Real-Time**
- 🧩 **Prisma ORM with MySQL**
- 🎨 **React + Tailwind Frontend**
- 📡 **Room-Based Socket Events**
- 🗄️ **Persistent Message Storage**

---

## 🛠️ Tech Stack

### **Backend**
- Node.js  
- Express.js  
- Socket.IO  
- Prisma ORM  
- MySQL Database  
- JSON Web Tokens (JWT)

### **Frontend**
- React.js  
- Tailwind CSS  
- Socket.IO Client

---

## 🧠 How It Works (Architecture)

1. **User logs in** → Backend verifies credentials → Returns a JWT token.
2. **Socket connects** with the token → Backend verifies it → Marks user **online**.
3. **User selects or creates a chat** → Users join chat rooms via socket.
4. **Message Sent**
   - Saved in database via Prisma  
   - Backend emits `messageReceived` to receiver’s personal room  
5. **Typing Indicator**
   - Frontend emits `typing` and `stopTyping` events  
   - Backend broadcasts to chat room participants  
6. **Presence System**
   - On connect → Backend emits `userOnline`  
   - On disconnect → Backend emits `userOffline`  
7. **Frontend UI updates in real-time** using all socket events.

---

## 📦 Setup & Installation

### 🔧 Backend Setup
```bash
cd backend
npm install

# Setup your MySQL database URL inside .env
# DATABASE_URL="mysql://user:password@host:port/database"

npx prisma migrate dev
npm run dev
```

---

### 🎨 Frontend Setup
```bash
cd frontend
npm install
npm start
```

Frontend will run on:  
👉 `http://localhost:3000`  
Backend will run on:  
👉 `http://localhost:3001`

---

## 🔐 Environment Variables

Create a `.env` file inside the **backend** folder with:

```
DATABASE_URL=mysql://USER:PASSWORD@HOST:PORT/DB_NAME
SECRET_KEY=your_jwt_secret
BASE_URL=http://localhost:3001
```

---

## 📡 Socket Events

### **Emit from Frontend → Backend**
| Event | Purpose |
|--------|----------|
| `joinChat` | Join a chat room |
| `typing` | Notify chat participants that user is typing |
| `stopTyping` | Notify typing stopped |

---

### **Received from Backend → Frontend**
| Event | Description |
|--------|-------------|
| `connected` | Socket authenticated successfully |
| `messageReceived` | New incoming message |
| `newChat` | New chat created involving user |
| `typing` | Someone is typing |
| `stopTyping` | Typing stopped |
| `userOnline` | A user came online |
| `userOffline` | A user went offline |
| `socketError` | Any socket level error |

---

## 📁 Folder Structure

```
sockify/
│
├── backend/
│   ├── prisma/
│   ├── controllers/
│   ├── routes/
│   ├── utils/
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── api.js
    │   ├── socket.js
    │   ├── App.js
    │   └── index.css
```

---

## 📸 UI Preview  
*(Add screenshots or GIFs here once UI is ready)*

---



## ⭐ Contribute

Pull requests are welcome.  
Feel free to improve UI, add new real-time features, or integrate group chat!

---

## 📄 License

MIT License — Free to use and modify.

