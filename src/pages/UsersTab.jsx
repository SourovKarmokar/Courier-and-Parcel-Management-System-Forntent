import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import socket from "../socket";

const UsersTab = () => {
  const { token } = useSelector((state) => state.user);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ===============================
  // 1️⃣ LOAD USERS
  // ===============================
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/v1/admin/users",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUsers(res.data.data || []);
      } catch (err) {
        console.error("Load users failed", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) loadUsers();
  }, [token]);

  // ===============================
  // 2️⃣ REALTIME ROLE UPDATE (SOCKET)
  // ===============================
  useEffect(() => {
    socket.on("user-role-updated", (data) => {
      setUsers((prev) =>
        prev.map((u) =>
          u._id === data.userId ? { ...u, role: data.role } : u
        )
      );
    });

    socket.on("user-deleted", (data) => {
      setUsers((prev) => prev.filter((u) => u._id !== data.userId));
    });

    return () => {
      socket.off("user-role-updated");
      socket.off("user-deleted");
    };
  }, []);

  // ===============================
  // 3️⃣ CHANGE ROLE
  // ===============================
  const handleRoleChange = async (id, role) => {
    try {
      await axios.put(
        `http://localhost:3000/api/v1/admin/users/${id}/role`,
        { role },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // ❌ UI update এখানে করবো না → socket করবে
    } catch (err) {
      console.error("Role update failed", err);
    }
  };

  // ===============================
  // 4️⃣ DELETE USER
  // ===============================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(
        `http://localhost:3000/api/v1/admin/users/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // ❌ UI update socket করবে
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  // ===============================
  // UI
  // ===============================
  if (loading) {
    return <p className="font-semibold">Loading users...</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">👥 User Management</h1>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs uppercase text-gray-600">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {users.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium">
                    {u.firstName} {u.lastName}
                  </td>

                  <td className="p-4 text-sm">{u.email}</td>

                  <td className="p-4">
                    {u.role === "admin" ? (
                      <span className="text-gray-500 font-semibold">
                        Admin
                      </span>
                    ) : (
                      <select
                        value={u.role}
                        onChange={(e) =>
                          handleRoleChange(u._id, e.target.value)
                        }
                        className="border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-400"
                      >
                        <option value="customer">Customer</option>
                        <option value="agent">Agent</option>
                      </select>
                    )}
                  </td>

                  <td className="p-4">
                    {u.role === "admin" ? (
                      <span className="text-gray-400 text-sm">
                        Protected
                      </span>
                    ) : (
                      <button
                        onClick={() => handleDelete(u._id)}
                        className="text-red-600 hover:underline text-sm"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersTab;
