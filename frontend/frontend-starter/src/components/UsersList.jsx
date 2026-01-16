import PropTypes from "prop-types";
import {
  Box,
  VStack,
  Text,
  Badge,
  Flex,
  Icon,
  Tooltip,
  Avatar,
} from "@chakra-ui/react";
import { FiUsers, FiCircle } from "react-icons/fi";

const UsersList = ({ users = [] }) => {
  return (
    <Box
      h="100%"
      w="100%"
      borderLeft="1px solid"
      borderColor="gray.200"
      bg="white"
      overflow="hidden"
    >
      {/* HEADER */}
      <Flex
        p={5}
        borderBottom="1px solid"
        borderColor="gray.200"
        align="center"
        position="sticky"
        top={0}
        bg="white"
        zIndex={1}
      >
        <Icon as={FiUsers} fontSize="20px" color="blue.500" mr={2} />
        <Text fontSize="lg" fontWeight="bold" color="gray.700">
          Members
        </Text>

        <Badge
          ml={2}
          colorScheme="blue"
          borderRadius="full"
          px={2}
          fontSize="xs"
        >
          {users.length}
        </Badge>
      </Flex>

      {/* USERS LIST */}
      <Box flex="1" overflowY="auto" p={4}>
        {users.length === 0 ? (
          <Text fontSize="sm" color="gray.500" textAlign="center">
            No active members
          </Text>
        ) : (
          <VStack align="stretch" spacing={3}>
            {users.map((user) => {
              if (!user?._id) return null;

              return (
                <Tooltip
                  key={user._id}
                  label={`${user.username} is online`}
                  placement="left"
                >
                  <Flex
                    p={3}
                    align="center"
                    borderRadius="lg"
                    borderWidth="1px"
                    borderColor="gray.100"
                    bg="white"
                    _hover={{ bg: "gray.50" }}
                  >
                    <Avatar
                      size="sm"
                      name={user.username}
                      bg="blue.500"
                      color="white"
                      mr={3}
                    />

                    <Box flex="1">
                      <Text
                        fontSize="sm"
                        fontWeight="medium"
                        color="gray.700"
                        noOfLines={1}
                      >
                        {user.username}
                      </Text>
                    </Box>

                    {/* ONLINE INDICATOR */}
                    <Flex
                      align="center"
                      bg="green.50"
                      px={2}
                      py={1}
                      borderRadius="full"
                    >
                      <Icon
                        as={FiCircle}
                        color="green.400"
                        fontSize="8px"
                        mr={1}
                      />
                      <Text fontSize="xs" color="green.600" fontWeight="medium">
                        online
                      </Text>
                    </Flex>
                  </Flex>
                </Tooltip>
              );
            })}
          </VStack>
        )}
      </Box>
    </Box>
  );
};

UsersList.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
    })
  ),
};

export default UsersList;
