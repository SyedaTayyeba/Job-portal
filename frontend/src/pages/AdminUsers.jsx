import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/axios";

const AdminUsers = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  // =====================================================
  // FETCH USERS
  // =====================================================

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login first.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.get(
        "/admin/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      setUsers(response.data.users || response.data || []);
    } catch (error) {
      console.log("Users Error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      setError(
        error.response?.data?.message ||
          "Users could not be loaded."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // DELETE USER
  // =====================================================

  const deleteUser = async (id) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login first.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(id);
    setError("");
    setSuccess("");

    try {
      const response = await api.delete(
        `/admin/users/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      setUsers((previousUsers) =>
        previousUsers.filter(
          (user) => user.id !== id
        )
      );

      setSuccess(
        response.data.message ||
          "User deleted successfully."
      );
    } catch (error) {
      console.log("Delete User Error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      setError(
        error.response?.data?.message ||
          "User could not be deleted."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    try {
      if (token) {
        await api.post(
          "/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );
      }
    } catch (error) {
      console.log("Logout Error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/login");
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-slate-600">
          Loading users...
        </p>
      </main>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <main className="min-h-screen bg-slate-100">

      {/* NAVBAR */}

      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">

          <Link
            to="/admin-dashboard"
            className="text-xl font-bold text-blue-600"
          >
            JobPortal
          </Link>

          <div className="flex items-center gap-4">

            <Link
              to="/admin-dashboard"
              className="text-sm font-medium text-slate-700 hover:text-blue-600 transition"
            >
              Dashboard
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="text-sm font-medium text-slate-700 hover:text-red-600 transition"
            >
              Logout
            </button>

          </div>
        </div>
      </nav>


      {/* CONTENT */}

      <section className="max-w-7xl mx-auto px-4 md:px-8 py-8">

        {/* HEADER */}

        <div className="mb-8">

          <h1 className="text-3xl font-bold text-slate-900">
            Manage Users
          </h1>

          <p className="mt-2 text-slate-600">
            View and manage all registered users.
          </p>

        </div>


        {/* ERROR */}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
            {error}
          </div>
        )}


        {/* SUCCESS */}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 text-sm">
            {success}
          </div>
        )}


        {/* EMPTY */}

        {users.length === 0 ? (

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 text-center">

            <h2 className="text-lg font-bold text-slate-900">
              No Users Found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              There are no registered users yet.
            </p>

          </div>

        ) : (

          /* USERS TABLE */

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

            <div className="overflow-x-auto">

              <table className="w-full text-sm">

                <thead className="bg-slate-50 border-b border-slate-200">

                  <tr>

                    <th className="text-left px-6 py-4 font-semibold text-slate-700">
                      ID
                    </th>

                    <th className="text-left px-6 py-4 font-semibold text-slate-700">
                      Name
                    </th>

                    <th className="text-left px-6 py-4 font-semibold text-slate-700">
                      Email
                    </th>

                    <th className="text-left px-6 py-4 font-semibold text-slate-700">
                      Role
                    </th>

                    <th className="text-left px-6 py-4 font-semibold text-slate-700">
                      Created
                    </th>

                    <th className="text-left px-6 py-4 font-semibold text-slate-700">
                      Actions
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {users.map((user) => {

                    const currentUser =
                      JSON.parse(
                        localStorage.getItem("user") || "null"
                      );

                    const isCurrentAdmin =
                      currentUser &&
                      Number(currentUser.id) === Number(user.id);

                    return (
                      <tr
                        key={user.id}
                        className="border-b border-slate-100 hover:bg-slate-50"
                      >

                        {/* ID */}

                        <td className="px-6 py-4 text-slate-600">
                          {user.id}
                        </td>


                        {/* NAME */}

                        <td className="px-6 py-4 font-medium text-slate-900">
                          {user.name || "N/A"}
                        </td>


                        {/* EMAIL */}

                        <td className="px-6 py-4 text-slate-600">
                          {user.email || "N/A"}
                        </td>


                        {/* ROLE */}

                        <td className="px-6 py-4">

                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              user.role === "admin"
                                ? "bg-purple-100 text-purple-700"
                                : user.role === "employer"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {user.role || "N/A"}
                          </span>

                        </td>


                        {/* CREATED */}

                        <td className="px-6 py-4 text-slate-500">

                          {user.created_at
                            ? new Date(
                                user.created_at
                              ).toLocaleDateString()
                            : "N/A"}

                        </td>


                        {/* ACTIONS */}

                        <td className="px-6 py-4">

                          {isCurrentAdmin ? (

                            <span className="text-xs text-slate-400">
                              Current Admin
                            </span>

                          ) : (

                            <button
                              type="button"
                              onClick={() =>
                                deleteUser(user.id)
                              }
                              disabled={
                                deletingId === user.id
                              }
                              className="px-4 py-2 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {deletingId === user.id
                                ? "Deleting..."
                                : "Delete"}
                            </button>

                          )}

                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>

          </div>

        )}

      </section>

    </main>
  );
};

export default AdminUsers;