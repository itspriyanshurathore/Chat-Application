import {
  Box,
  VStack,
  Text,
  Flex,
  Spinner,
  Button,
  Badge,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { FiPlus, FiEdit, FiTrash2, FiLogOut } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import API_BASE_URL from "../Services/api";


function Sidebar({ setSelectedGroup }) {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  // editing group
  const [editingGroup, setEditingGroup] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const toast = useToast();
  const navigate = useNavigate();

  const createModal = useDisclosure();
  const editModal = useDisclosure();

  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const token = userInfo?.token;
  const userId = userInfo?._id;
  const isAdmin = Boolean(userInfo?.isAdmin);

  /* ================= HELPERS ================= */
  const isGroupAdmin = (group) => group?.admins?.some((a) => a?._id === userId);

  const isMember = (group) => group?.members?.some((m) => m?._id === userId);

  /* ================= FETCH GROUPS ================= */
  const fetchGroups = async () => {
    try {
      const endpoint = `${API_BASE_URL}/api/groups`;
      const res = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setGroups(Array.isArray(data) ? data : []);
    } catch {
      setGroups([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchGroups();
    else setLoading(false);
  }, [token]);

  /* ================= ACTIONS ================= */
  const createGroup = async () => {
    await fetch(`${API_BASE_URL}/api/groups/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, description }),
    });

    toast({ title: "Group created", status: "success" });
    createModal.onClose();
    setName("");
    setDescription("");
    fetchGroups();
  };

  const updateGroup = async () => {
    if (!editingGroup) return;

    await fetch(`${API_BASE_URL}/api/groups/${editingGroup._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, description }),
    });

    toast({ title: "Group updated", status: "success" });
    editModal.onClose();
    fetchGroups();
  };

  const deleteGroup = async (groupId) => {
    if (!window.confirm("Delete this group?")) return;

    await fetch(`${API_BASE_URL}/api/groups/${groupId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    toast({ title: "Group deleted", status: "success" });
    fetchGroups();
  };

  const joinGroup = async (groupId) => {
    await fetch(`${API_BASE_URL}/api/groups/${groupId}/join`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    toast({ title: "Joined group", status: "success" });
    fetchGroups();
  };

  const leaveGroup = async (groupId) => {
    await fetch(`${API_BASE_URL}/api/groups/${groupId}/leave`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    toast({ title: "Left group", status: "success" });
    fetchGroups();
  };

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    toast({
      title: "Logged out successfully",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
    navigate("/login");
  };

  /* ================= UI ================= */
  if (loading) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner />
      </Flex>
    );
  }

  return (
    <Box
      w="300px"
      p={4}
      borderRight="1px solid #E2E8F0"
      position="relative"
      h="100vh"
    >
      {/* HEADER */}
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="lg" fontWeight="bold">
          Groups
        </Text>

        {isAdmin && (
          <IconButton
            icon={<FiPlus />}
            size="sm"
            variant="ghost"
            onClick={createModal.onOpen}
            aria-label="Create Group"
          />
        )}
      </Flex>

      {/* GROUP LIST */}
      <VStack spacing={4} align="stretch" mb="80px">
        {groups.map((group) => {
          const member = isMember(group);
          const admin = isGroupAdmin(group);

          return (
            <Box
              key={group._id}
              p={4}
              borderRadius="lg"
              borderWidth="1px"
              cursor="pointer"
              onClick={() => setSelectedGroup(group)}
              bg={member ? "blue.50" : "white"}
              borderColor={member ? "blue.300" : "gray.200"}
              _hover={{ shadow: "md" }}
            >
              <Flex justify="space-between" align="start">
                <Box>
                  <Flex align="center" gap={2}>
                    <Text fontWeight="bold">{group.name}</Text>
                    {member && (
                      <Badge colorScheme="blue" fontSize="0.7em">
                        JOINED
                      </Badge>
                    )}
                  </Flex>

                  <Text fontSize="sm" color="gray.600" mt={1}>
                    {group.description}
                  </Text>
                </Box>

                {!member ? (
                  <Button size="sm" onClick={() => joinGroup(group._id)}>
                    Join
                  </Button>
                ) : !admin ? (
                  <Button
                    size="sm"
                    colorScheme="red"
                    variant="outline"
                    onClick={() => leaveGroup(group._id)}
                  >
                    Leave
                  </Button>
                ) : (
                  <Flex gap={1}>
                    <IconButton
                      size="sm"
                      icon={<FiEdit />}
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingGroup(group);
                        setName(group.name);
                        setDescription(group.description);
                        editModal.onOpen();
                      }}
                    />
                    <IconButton
                      size="sm"
                      icon={<FiTrash2 />}
                      colorScheme="red"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteGroup(group._id);
                      }}
                    />
                  </Flex>
                )}
              </Flex>
            </Box>
          );
        })}
      </VStack>

      {/* LOGOUT */}
      <Box
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        p={4}
        borderTop="1px solid"
        borderColor="gray.200"
        bg="white"
      >
        <Button
          width="100%"
          colorScheme="red"
          variant="ghost"
          leftIcon={<FiLogOut />}
          onClick={handleLogout}
          _hover={{ bg: "red.50" }}
        >
          Logout
        </Button>
      </Box>

      {/* CREATE MODAL */}
      <Modal isOpen={createModal.isOpen} onClose={createModal.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Group</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </FormControl>

            <FormControl mt={3}>
              <FormLabel>Description</FormLabel>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={createGroup}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* EDIT MODAL */}
      <Modal isOpen={editModal.isOpen} onClose={editModal.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Group</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </FormControl>

            <FormControl mt={3}>
              <FormLabel>Description</FormLabel>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={updateGroup}>
              Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

Sidebar.propTypes = {
  setSelectedGroup: PropTypes.func.isRequired,
};

export default Sidebar;
