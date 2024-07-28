import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";

import axios from "../../../config/axios";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useState({
    email: "",
    status: "",
    privilege: "",
  });

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/admin/get-users", {
        params: {
          page,
          ...searchParams,
        },
      });
      setTotalPages(res.data.totalPages);
      setUsers(res.data.docs);
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, searchParams]);

  const handleStatusChange = async (userId, status) => {
    try {
      await axios.post("/admin/change-user-status", { id: userId, status });
      toast.success("User status updated successfully");
      fetchUsers();
    } catch (err) {
      toast.error("Failed to update user status");
    }
  };

  const handlePrivilegeChange = async (userId, privilege) => {
    try {
      await axios.post("/admin/change-user-privilege", {
        id: userId,
        privilege,
      });
      toast.success("User privilege updated successfully");
      fetchUsers();
    } catch (err) {
      toast.error("Failed to update user privilege");
    }
  };

  const handlePageClick = ({ selected }) => {
    setPage(selected + 1);
  };

  const handleSearchChange = (e) => {
    setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1); // Reset to first page on new search
    fetchUsers();
  };

  return (
    <div className="container mx-auto p-4 bg-slate-900">
      <h1 className="text-2xl font-bold mb-4 text-white">User Management</h1>
      <form className="mb-4" onSubmit={handleSearchSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-white mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="text"
              value={searchParams.email}
              onChange={handleSearchChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-white mb-2" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={searchParams.status}
              onChange={handleSearchChange}
              className="w-full p-2 border rounded"
            >
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="restricted">Restricted</option>
            </select>
          </div>
          <div>
            <label className="block text-white mb-2" htmlFor="privilege">
              Privilege
            </label>
            <select
              id="privilege"
              name="privilege"
              value={searchParams.privilege}
              onChange={handleSearchChange}
              className="w-full p-2 border rounded"
            >
              <option value="">All</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
      </form>
      <table className="min-w-full bg-gray-800 text-white">
        <thead>
          <tr>
            <th className="py-2">Email</th>
            <th className="py-2">Status</th>
            <th className="py-2">Privilege</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-b border-gray-700">
              <td className="py-2 px-4">{user.email}</td>
              <td className="py-2 px-4 text-center">
                <select
                  value={user.status}
                  onChange={(e) => handleStatusChange(user._id, e.target.value)}
                  className="border rounded p-2 bg-gray-900 text-white"
                >
                  <option value="active">Active</option>
                  <option value="restricted">Restricted</option>
                </select>
              </td>
              <td className="py-2 px-4 text-center">
                <select
                  value={user.privilege}
                  onChange={(e) =>
                    handlePrivilegeChange(user._id, e.target.value)
                  }
                  className="border rounded p-2 bg-gray-900 text-white"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        <ReactPaginate
          className="pagination mt-8 p-2"
          previousLabel={"<"}
          nextLabel={">"}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={totalPages}
          marginPagesDisplayed={1}
          pageRangeDisplayed={2}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          subContainerClassName={"pages pagination"}
          activeClassName={"active"}
        />
      </div>
    </div>
  );
};

export default UserList;
