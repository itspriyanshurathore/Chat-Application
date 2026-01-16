import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { FiUserPlus } from "react-icons/fi";
import { useState } from "react";
import axios from "axios";

// axios global config
axios.defaults.withCredentials = true;

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      toast({
        title: "All fields are required",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        "http://localhost:3000/api/users/register",
        { username, email, password },
        { withCredentials: true }
      );

      toast({
        title: "Account created successfully",
        description: "You can now log in",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });

      navigate("/login");
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error?.response?.data?.message || "Something went wrong",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      w="100%"
      h="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgGradient="linear(to-r, purple.600, blue.600)"
    >
      <Box
        display="flex"
        w={["95%", "90%", "80%", "75%"]}
        maxW="1200px"
        h={["auto", "auto", "600px"]}
        borderRadius="2xl"
        overflow="hidden"
        boxShadow="2xl"
      >
        {/* Left Panel */}
        <Box
          display={["none", "none", "flex"]}
          w="50%"
          bgImage="url('https://images.unsplash.com/photo-1579548122080-c35fd6820ecb')"
          bgSize="cover"
          bgPosition="center"
          position="relative"
        >
          <Box
            position="absolute"
            inset="0"
            bg="blackAlpha.600"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            p={10}
            color="white"
          >
            <Text fontSize="4xl" fontWeight="bold" mb={4}>
              Join Our Community
            </Text>
            <Text fontSize="lg" maxW="400px">
              Create an account and start chatting with your friends instantly
            </Text>
          </Box>
        </Box>

        {/* Right Panel */}
        <Box
          w={["100%", "100%", "50%"]}
          bg="white"
          p={[6, 8, 10]}
          display="flex"
          flexDirection="column"
          justifyContent="center"
        >
          <Box display={["block", "block", "none"]} textAlign="center" mb={6}>
            <Box as={FiUserPlus} mx="auto" fontSize="3rem" color="purple.600" />
            <Text fontSize="2xl" fontWeight="bold">
              Create Account
            </Text>
          </Box>

          <VStack
            as="form"
            spacing={6}
            w="100%"
            maxW="400px"
            mx="auto"
            onSubmit={handleSubmit}
          >
            <FormControl isRequired>
              <FormLabel>Username</FormLabel>
              <Input
                placeholder="Choose a username"
                size="lg"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="Enter your email"
                size="lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                placeholder="Create a password"
                size="lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="purple"
              width="100%"
              size="lg"
              isLoading={loading}
              leftIcon={<FiUserPlus />}
            >
              Create Account
            </Button>

            <Text color="gray.600">
              Already have an account?{" "}
              <Link to="/login" style={{ color: "#805AD5" }}>
                Sign in
              </Link>
            </Text>
          </VStack>
        </Box>
      </Box>
    </Box>
  );
};

export default Register;
