# 🚀 Groupify – Real-Time Chat Application

**Groupify** is a modern, real-time chat application designed for seamless team and group communication. It supports secure authentication, group-based messaging, live presence, and instant interactions powered by real-time technologies.

---

## 🌟 Powerful Features  
Everything you need for seamless team collaboration.

### 🔐 Secure Authentication  
**Secure**  
- Register and log in securely  
- Encrypted passwords for maximum safety  
- Token-based authentication  

---

### 👥 Group Management  
**Real-time**  
- Create new groups  
- Join or leave groups easily  
- Manage multiple group conversations in one place  
- **Admins can access any group without joining**  
- **Only admins can remove users from groups**

---

### 🟢 Online Presence  
**Live**  
- See who is currently online  
- Real-time active status inside groups  

---

### ✍️ Typing Indicators  
**Interactive**  
- Real-time typing indicators  
- Know instantly when someone is typing  

---

### 💬 Instant Messaging  
**Fast**  
- Send and receive messages instantly  
- Real-time message delivery  
- Smooth and responsive chat experience  

---

### 🌍 Global Access  
**24/7**  
- Access chats anytime, anywhere  
- Persistent real-time connections  

---

## 🛠️ Tech Stack

### Frontend
- React (Vite)
- Chakra UI
- Socket.IO Client

### Backend
- Node.js
- Express.js
- MongoDB
- Socket.IO
- JWT Authentication

---

## 🔐 Roles & Permissions

- **Admin**
  - Can create groups
  - Can edit / delete groups
  - Can access any group without joining
  

- **User**
  - Can join or leave groups
  - Can send and receive messages
  - Can view online users and typing indicators

---

## ⚙️ Environment Variables

### Backend (`.env`)
```env
MONGO_URL=your_mongodb_connection_string
NODE_ENV=production
