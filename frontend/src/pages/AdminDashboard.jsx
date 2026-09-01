import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/axios";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total_users: 0,
    job_seekers: 0,
    employers: 0,
    jobs: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH ADMIN STATS
  // =====================================================

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login first.");
      setLoading(false);
      navigate("/login");
      return;
    }

    try {
      const response = await api.get(
        "admin/stats",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      setStats({
        total_users: response.data.total_users || 0,
        job_seekers: response.data.job_seekers || 0,
        employers: response.data.employers || 0,
        jobs: response.data.jobs || 0,
      });
    } catch (error) {
      console.log("Admin Stats Error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      if (error.response?.status === 403) {
        setError("You are not authorized to access the admin dashboard.");
        setLoading(false);
        return;
      }

      setError(
        error.response?.data?.message ||
          "Dashboard statistics could not be loaded."
      );
    } finally {
      setLoading(false);
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
          "logout",
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
          Loading dashboard...
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
              to="/admin-users"
              className="text-sm font-medium text-slate-700 hover:text-blue-600 transition"
            >
              Users
            </Link>

            <Link
              to="/admin-jobs"
              className="text-sm font-medium text-slate-700 hover:text-blue-600 transition"
            >
              Jobs
            </Link>

            <Link
              to="/admin-employers"
              className="text-sm font-medium text-slate-700 hover:text-blue-600 transition"
            >
              Employers
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


      {/* MAIN */}

      <section className="max-w-7xl mx-auto px-4 md:px-8 py-8">

        {/* HEADER */}

        <div className="mb-8">

          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            Admin Dashboard
          </h1>

          <p className="mt-2 text-slate-600">
            Manage users, employers, jobs and the overall JobPortal system.
          </p>

        </div>


        {/* ERROR */}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
            {error}
          </div>
        )}


        {/* STATS */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

          {/* TOTAL USERS */}

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">

            <p className="text-sm text-slate-500">
              Total Users
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              {stats.total_users}
            </h2>

          </div>


          {/* JOB SEEKERS */}

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">

            <p className="text-sm text-slate-500">
              Job Seekers
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              {stats.job_seekers}
            </h2>

          </div>


          {/* EMPLOYERS */}

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">

            <p className="text-sm text-slate-500">
              Employers
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              {stats.employers}
            </h2>

          </div>


          {/* JOBS */}

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">

            <p className="text-sm text-slate-500">
              Jobs
            </p>

            <h2 className="mt-2 text-3xl font-bold text-blue-600">
              {stats.jobs}
            </h2>

          </div>

        </div>


        {/* MANAGEMENT */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* USERS */}

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

            <h2 className="text-lg font-bold text-slate-900">
              Manage Users
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              View and manage registered users.
            </p>

            <Link
              to="/admin-users"
              className="mt-5 block w-full text-center px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition"
            >
              View Users
            </Link>

          </div>


          {/* JOBS */}

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

            <h2 className="text-lg font-bold text-slate-900">
              Manage Jobs
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Review and manage jobs posted by employers.
            </p>

            <Link
              to="/admin-jobs"
              className="mt-5 block w-full text-center px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition"
            >
              View Jobs
            </Link>

          </div>


          {/* EMPLOYERS */}

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

            <h2 className="text-lg font-bold text-slate-900">
              Manage Employers
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Review employer accounts and companies.
            </p>

            <Link
              to="/admin-employers"
              className="mt-5 block w-full text-center px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition"
            >
              View Employers
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
};

export default AdminDashboard;