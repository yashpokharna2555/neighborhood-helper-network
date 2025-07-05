const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const socketio = require("socket.io");

// Routes & Models
const authRoutes = require("./routes/auth");
const helpRoutes = require("./routes/help");
const chatRoutes = require("./routes/chat");
const Chat = require("./models/Chat");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/help", helpRoutes);
app.use("/api/chat", chatRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

// Socket.IO Events
io.on("connection", (socket) => {
  console.log("🔌 New client connected:", socket.id);

  socket.on("joinRoom", ({ requestId }) => {
    socket.join(requestId);
    console.log(`✅ Socket ${socket.id} joined room ${requestId}`);

    // Optional: notify room users
    io.to(requestId).emit("roomStatus", {
      message: `User ${socket.id} joined the room.`,
    });
  });

  socket.on("sendMessage", async ({ requestId, sender, text }) => {
    try {
      const newMessage = new Chat({ requestId, sender, text });
      await newMessage.save();

      io.to(requestId).emit("receiveMessage", {
        sender,
        text,
        timestamp: newMessage.timestamp,
      });
    } catch (error) {
      console.error("❌ Error saving message:", error.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
