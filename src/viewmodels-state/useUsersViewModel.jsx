import { useState } from "react";

export const useUsersViewModel = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // TODO: Implement API calls to fetch users
  const fetchUsers = async () => {
    setIsLoading(true);
    setError("");
    try {
      // Example API call
      // const data = await usersApi.getUsers({ page, limit, query });
      // setUsers(data.items);
    } catch (error) {
      setError(error.message || "Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    users,
    page,
    limit,
    query,
    isLoading,
    error,
    setPage,
    setLimit,
    setQuery,
    fetchUsers,
  };
};


