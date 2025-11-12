import cookie from "cookie";
import jwt from "jsonwebtoken";
import { Server, Socket } from "socket.io";
import { ChatEventEnum } from '../utils/constants.js';
import { PrismaClient } from '@prisma/client';// Assuming you have this utility function
const prisma = new PrismaClient();
import dotenv from "dotenv";
dotenv.config();

const mountJoinChatEvent = (socket) => {
  socket.on(ChatEventEnum.JOIN_CHAT_EVENT, (chatId) => {
    console.log(`User joined the chat 🤝. chatId: `, chatId);
    // joining the room with the chatId will allow specific events to be fired where we don't bother about the users like typing events
    // E.g. When user types we don't want to emit that event to specific participant.
    // We want to just emit that to the chat where the typing is happening
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

      socket.join(user.id.toString());
      socket.emit(ChatEventEnum.CONNECTED_EVENT);
      console.log("User connected 🗼. userId: ", user.id);

   
      mountJoinChatEvent(socket);
      mountParticipantTypingEvent(socket);
      mountParticipantStoppedTypingEvent(socket);

      socket.on(ChatEventEnum.DISCONNECT_EVENT, () => {
        console.log("user has disconnected 🚫. userId: " + socket.id);

        if (socket.id) {
          socket.leave(socket.id);
        }
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
