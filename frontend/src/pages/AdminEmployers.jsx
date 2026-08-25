import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const AdminEmployers = () => {
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEmployers();
  }, []);

  const fetchEmployers = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login first.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        "http://localhost:8000/api/admin/employers",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      setEmployers(
        response.data.employers || response.data
      );
    } catch (error) {
      console.log("Employers Error:", error);

      setError(
        error.response?.data?.message ||
          "Employers could not be loaded."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-slate-600">
          Loading employers...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <Link
            to="/admin-dashboard"
            className="text-xl font-bold text-blue-600"
          >
            JobPortal
          </Link>

          <Link
            to="/admin-dashboard"
            className="text-sm font-medium text-slate-700 hover:text-blue-600"
          >
            Dashboard
          </Link>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Manage Employers
          </h1>

          <p className="mt-2 text-slate-600">
            View employer accounts and their companies.
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
            {error}
          </div>
        )}

        {!error && employers.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
            <h2 className="text-lg font-bold text-slate-900">
              No Employers Found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              There are no employer accounts yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {employers.map((employer) => (
              <div
                key={employer.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">
                    {employer.name
                      ? employer.name.charAt(0).toUpperCase()
                      : "E"}
                  </div>

                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                    Employer
                  </span>
                </div>

                <h2 className="mt-5 text-xl font-bold text-slate-900">
                  {employer.name || "Unnamed Employer"}
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  {employer.email || "Email not available"}
                </p>

                <div className="mt-5 pt-5 border-t border-slate-100">
                  <p className="text-sm text-slate-500">
                    User ID:{" "}
                    <span className="font-medium text-slate-700">
                      {employer.id}
                    </span>
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    Joined:{" "}
                    <span className="font-medium text-slate-700">
                      {employer.created_at
                        ? new Date(
                            employer.created_at
                          ).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default AdminEmployers;