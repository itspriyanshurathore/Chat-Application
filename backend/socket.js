const connectedUsers = new Map();

module.exports = (io) => {
  io.on("connection", (socket) => {
    const user = socket.handshake.auth && socket.handshake.auth.user;

    // ✅ SAFETY CHECK
    if (!user || !user.username) {
      console.log("❌ Socket connected without user. Disconnecting...");
      socket.disconnect(true);
      return;
    }

    console.log("🟢 User connected:", user.username);

    // ============== JOIN ROOM ==============
    socket.on("join-room", (groupId) => {
      if (!groupId) return;

      socket.join(groupId);

      connectedUsers.set(socket.id, { user, groupId });

      const usersInRoom = Array.from(connectedUsers.values())
        .filter((u) => u.groupId === groupId)
        .map((u) => u.user);

      io.to(groupId).emit("room-users", usersInRoom);

      socket.to(groupId).emit("notification", {
        type: "USER_JOINED",
        message: `${user.username} joined the room`,
        user,
      });
    });

    // ============== LEAVE ROOM ==============
    socket.on("leave-room", (groupId) => {
      socket.leave(groupId);
      connectedUsers.delete(socket.id);

      socket.to(groupId).emit("notification", {
        type: "USER_LEFT",
        message: `${user.username} left the room`,
        user,
      });
    });

    // ============== NEW MESSAGE ==============
    socket.on("new-message", (message) => {
      if (!message || !message.groupId) return;
      socket.to(message.groupId).emit("message-received", message);
    });

    // ============== TYPING ==============
    socket.on("typing", (groupId) => {
      socket.to(groupId).emit("typing", user.username);
    });

    socket.on("stop-typing", (groupId) => {
      socket.to(groupId).emit("stop-typing", user.username);
    });

    // ============== DISCONNECT ==============
    socket.on("disconnect", () => {
      const userInfo = connectedUsers.get(socket.id);

      if (userInfo) {
        socket.to(userInfo.groupId).emit("notification", {
          type: "USER_LEFT",
          message: `${user.username} disconnected`,
          user,
        });
        connectedUsers.delete(socket.id);
      }

      console.log("🔴 User disconnected:", user.username);
    });
  });
};
