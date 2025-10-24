import React from "react";
import { useUsersViewModel } from "../../viewmodels-state/useUsersViewModel";

export default function Users() {
  const { users, page, limit, query, isLoading, error, setPage, setLimit, setQuery, fetchUsers } = useUsersViewModel();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Customers</h1>
      <p className="text-gray-600">User management page (data table, add/edit/delete buttons).</p>
      
      {/* TODO: Implement users table using users state */}
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
}


