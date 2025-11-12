
import jwt from "jsonwebtoken";
import { ChatEventEnum } from '../utils/constants.js';
import { PrismaClient } from '@prisma/client';// Assuming you have this utility function
const prisma = new PrismaClient();
import dotenv from "dotenv";
dotenv.config();

const mountJoinChatEvent = (socket) => {
  socket.on(ChatEventEnum.JOIN_CHAT_EVENT, (chatId) => {
    console.log(`User joined the chat 🤝. chatId: `, chatId);
    socket.join(chatId);
  });
};

const mountParticipantTypingEvent = (socket) => {
  socket.on(ChatEventEnum.TYPING_EVENT, (chatId) => {
    socket.in(chatId).emit(ChatEventEnum.TYPING_EVENT, chatId);
  });
};

const mountParticipantStoppedTypingEvent = (socket) => {
  socket.on(ChatEventEnum.STOP_TYPING_EVENT, (chatId) => {
    socket.in(chatId).emit(ChatEventEnum.STOP_TYPING_EVENT, chatId);
  });
};

const initializeSocketIO = (io) => {
  return io.on("connection", async (socket) => {
    try {

      const token = socket.handshake.headers.authorization.replace('Bearer ', '');

      // Verify and decode the token
      const decoded = jwt.verify(token, process.env.SECRET_KEY);

      const user = await prisma.user.findUnique({
        where: {
          id: decoded.userId,
        },
      })
      if (!user) {
        return res.status(401).json({
          status: 200,
          message: 'Un-authorized handshake. Token is invalid',
          success: false,
        })

      }
      socket.user = user;

      // Mark user online in DB
      await prisma.user.update({
        where: { id: user.id },
        data: { isOnline: true },
      });

      // Notify all friends/participants that user is online
      io.emit("userOnline", { userId: user.id, isOnline: true });


      socket.join(user.id.toString());
      socket.emit(ChatEventEnum.CONNECTED_EVENT);
      console.log("User connected 🗼. userId: ", user.id);


      mountJoinChatEvent(socket);
      mountParticipantTypingEvent(socket);
      mountParticipantStoppedTypingEvent(socket);

      socket.on(ChatEventEnum.DISCONNECT_EVENT, async() => {
        console.log("user has disconnected 🚫. userId: " + socket.id);

        if (socket.id) {
          socket.leave(socket.id);
        }

        await prisma.user.update({
          where: { id: user.id },
          data: { isOnline: false },
        });
        console.log(`🔴 User offline: ${user.full_name} (${user.id})`);
        io.emit("userOffline", { userId: user.id, isOnline: false });
      });
    } catch (error) {
      socket.emit(
        ChatEventEnum.SOCKET_ERROR_EVENT,
        error?.message || "Something went wrong while connecting to the socket."
      );
    }
  });
};

const emitSocketEvent = (req, roomId, event, payload) => {
  req.app.get("io").in(roomId).emit(event, payload);
};

export { initializeSocketIO, emitSocketEvent };
