import {
  Box,
  Flex,
  Text,
  Input,
  Button,
  Avatar,
  VStack,
  Icon,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { FiSend, FiInfo, FiMessageCircle } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import io from "socket.io-client";
import UsersList from "./UsersList";

const ENDPOINT = "http://localhost:3000";
let socket;

const ChatArea = ({ selectedGroup }) => {
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [typingUser, setTypingUser] = useState("");

  const messagesEndRef = useRef(null);

  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

  /* ================= SOCKET CONNECTION ================= */
  useEffect(() => {
    if (!userInfo?._id || !userInfo?.username) return;

    socket = io(ENDPOINT, {
      auth: {
        user: {
          _id: userInfo._id,
          username: userInfo.username,
        },
      },
    });

    socket.on("message-received", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("room-users", (users) => {
      setOnlineUsers(users);
    });

    socket.on("typing", (username) => {
      setTypingUser(username);
    });

    socket.on("stop-typing", () => {
      setTypingUser("");
    });

    return () => {
      socket.disconnect();
    };
  }, [userInfo?._id, userInfo?.username]);

  /* ================= JOIN / LEAVE ROOM ================= */
  useEffect(() => {
    if (!selectedGroup?._id || !socket) return;

    setMessages([]);
    socket.emit("join-room", selectedGroup._id);

    return () => {
      socket.emit("leave-room", selectedGroup._id);
    };
  }, [selectedGroup?._id]);

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ================= SEND MESSAGE ================= */
  const sendMessage = () => {
    if (!message.trim() || !selectedGroup || !socket) return;

    const msg = {
      groupId: selectedGroup._id,
      content: message,
      sender: {
        _id: userInfo._id,
        username: userInfo.username,
      },
      createdAt: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    socket.emit("new-message", msg);
    setMessages((prev) => [...prev, msg]);
    setMessage("");
    socket.emit("stop-typing", selectedGroup._id);
  };

  /* ================= TYPING HANDLER ================= */
  const handleTyping = (e) => {
    setMessage(e.target.value);
    socket.emit("typing", selectedGroup._id);

    setTimeout(() => {
      socket.emit("stop-typing", selectedGroup._id);
    }, 1500);
  };

  /* ================= EMPTY STATE (UPDATED UI) ================= */
  if (!selectedGroup) {
    return (
      <Flex
        flex="1"
        align="center"
        justify="center"
        bg="gray.50"
        direction="column"
        gap={4}
      >
        <Icon as={FiMessageCircle} fontSize="64px" color="blue.400" />
        <Text fontSize="2xl" fontWeight="bold" color="gray.700">
          Welcome to Chat
        </Text>
        <Text fontSize="md" color="gray.500">
          Select a group to start chatting
        </Text>
      </Flex>
    );
  }

  return (
    <Flex h="100%">
      {/* ================= CHAT ================= */}
      <Box flex="1" display="flex" flexDirection="column" bg="gray.50">
        {/* HEADER */}
        <Flex
          px={6}
          py={4}
          bg="white"
          borderBottom="1px solid"
          borderColor="gray.200"
          align="center"
        >
          <Icon as={FiMessageCircle} fontSize="22px" color="blue.500" mr={3} />
          <Box flex="1">
            <Text fontSize="lg" fontWeight="bold">
              {selectedGroup.name}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {selectedGroup.description}
            </Text>
          </Box>
          <Icon as={FiInfo} fontSize="20px" color="gray.400" />
        </Flex>

        {/* MESSAGES */}
        <VStack
          flex="1"
          spacing={4}
          align="stretch"
          px={6}
          py={4}
          overflowY="auto"
        >
          {messages.map((msg, index) => {
            const isMine = msg.sender?._id === userInfo._id;

            return (
              <Box
                key={index}
                alignSelf={isMine ? "flex-end" : "flex-start"}
                maxW="70%"
              >
                <Flex direction="column" gap={1}>
                  <Flex
                    align="center"
                    gap={2}
                    justify={isMine ? "flex-end" : "flex-start"}
                  >
                    {!isMine && <Avatar size="xs" name={msg.sender.username} />}
                    <Text fontSize="xs" color="gray.500">
                      {msg.sender.username} • {msg.createdAt}
                    </Text>
                    {isMine && <Avatar size="xs" name={msg.sender.username} />}
                  </Flex>

                  <Box
                    bg={isMine ? "blue.500" : "white"}
                    color={isMine ? "white" : "gray.800"}
                    p={3}
                    borderRadius="lg"
                    boxShadow="sm"
                  >
                    <Text>{msg.content}</Text>
                  </Box>
                </Flex>
              </Box>
            );
          })}

          {typingUser && (
            <Text fontSize="sm" color="gray.500">
              {typingUser} is typing...
            </Text>
          )}

          <div ref={messagesEndRef} />
        </VStack>

        {/* INPUT */}
        <Box p={4} bg="white" borderTop="1px solid" borderColor="gray.200">
          <InputGroup size="lg">
            <Input
              placeholder="Type your message..."
              value={message}
              onChange={handleTyping}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <InputRightElement width="4.5rem">
              <Button colorScheme="blue" onClick={sendMessage}>
                <Icon as={FiSend} />
              </Button>
            </InputRightElement>
          </InputGroup>
        </Box>
      </Box>

      {/* ================= ONLINE USERS ================= */}
      <Box w="260px" borderLeft="1px solid" borderColor="gray.200" bg="white">
        <UsersList users={onlineUsers} />
      </Box>
    </Flex>
  );
};

ChatArea.propTypes = {
  selectedGroup: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
  }),
};

export default ChatArea;
