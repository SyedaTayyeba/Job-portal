import { Link ,useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../lib/axios";

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Jobs backend se fetch karna
  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/jobs");

      console.log("Jobs from backend:", response.data);

      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);

      setError("Unable to load jobs.");
    } finally {
      setLoading(false);
    }
  };
const navigate = useNavigate();

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
  useEffect(() => {
    fetchJobs();
  }, []);

  // Job delete karna
  const handleDelete = async (jobId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await api.delete(`/jobs/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Delete ke baad list se job remove
      setJobs((previousJobs) =>
        previousJobs.filter((job) => job.id !== jobId)
      );

      alert("Job deleted successfully.");
    } catch (error) {
      console.error("Error deleting job:", error);

      alert(
        error.response?.data?.message ||
          "Unable to delete job."
      );
    }
  };

  return (
    <main className="min-h-screen bg-slate-100">

      {/* ================= NAVBAR ================= */}

      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">

          {/* Logo */}
          <Link
            to="/employer-dashboard"
            className="text-xl font-bold text-blue-600"
          >
            JobPortal
          </Link>

          {/* Navbar */}
          <div className="flex items-center gap-4">

            <Link
              to="/profile"
              className="text-sm font-medium text-slate-700 hover:text-blue-600 transition"
            >
              Profile
            </Link>

         <button
  type="button"
  onClick={handleLogout}
  className="text-sm font-medium text-slate-700 hover:text-red-600 transition"
>
  Logout
</button>
            <Link
              to="/create-job"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition"
            >
              Post a New Job
            </Link>

          </div>
        </div>
      </nav>

      {/* ================= MAIN ================= */}

      <section className="max-w-7xl mx-auto px-4 md:px-8 py-8">

        {/* Welcome */}

        <div className="mb-8">

          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            Welcome back, Employer!
          </h1>

          <p className="mt-2 text-slate-600">
            Manage your jobs and find the right candidates for your company.
          </p>

        </div>

        {/* ================= STATS ================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">

          {/* Posted Jobs */}

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">

            <p className="text-sm text-slate-500">
              Posted Jobs
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              {loading ? "..." : jobs.length}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Jobs currently posted
            </p>

          </div>

          {/* Applications */}

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">

            <p className="text-sm text-slate-500">
              Applications
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              0
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Applications received
            </p>

          </div>

          {/* Company Profile */}

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">

            <p className="text-sm text-slate-500">
              Company Profile
            </p>

            <h2 className="mt-2 text-3xl font-bold text-blue-600">
              0%
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Complete your company profile
            </p>

          </div>

        </div>

        {/* ================= CONTENT ================= */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ================= YOUR JOBS ================= */}

          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

            <div className="flex items-center justify-between mb-6">

              <h2 className="text-lg font-bold text-slate-900">
                Your Jobs
              </h2>

              <Link
                to="/employer-jobs"
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                View all
              </Link>

            </div>

            {/* Loading */}

            {loading && (
              <div className="text-center py-12">

                <p className="text-sm text-slate-500">
                  Loading your jobs...
                </p>

              </div>
            )}

            {/* Error */}

            {!loading && error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-center">

                <p className="text-sm text-red-600">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={fetchJobs}
                  className="mt-3 text-sm font-semibold text-red-700 hover:underline"
                >
                  Try Again
                </button>

              </div>
            )}

            {/* No Jobs */}

            {!loading && !error && jobs.length === 0 && (
              <div className="text-center py-12">

                <p className="text-slate-500 text-sm">
                  You haven't posted any jobs yet.
                </p>

                <Link
                  to="/create-job"
                  className="inline-block mt-4 px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
                >
                  Post a Job
                </Link>

              </div>
            )}

            {/* Jobs */}

            {!loading && !error && jobs.length > 0 && (
              <div className="space-y-4">

                {jobs.slice(0, 5).map((job) => (

                  <div
                    key={job.id}
                    className="border border-slate-200 rounded-xl p-5 hover:shadow-sm transition"
                  >

                    {/* Job top */}

                    <div className="flex items-start justify-between gap-4">

                      <div>

                        <h3 className="text-lg font-bold text-slate-900">
                          {job.title}
                        </h3>

                        <p className="mt-1 text-sm font-medium text-blue-600">
                          {job.company?.name || "Company"}
                        </p>

                      </div>

                      {/* Status */}

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          job.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {job.status}
                      </span>

                    </div>

                    {/* Job information */}

                    <div className="mt-4 space-y-1">

                      <p className="text-sm text-slate-500">
                        📍 {job.location || "Location not specified"}
                      </p>

                      <p className="text-sm text-slate-500">
                        💰 PKR {job.salary}
                      </p>

                    </div>

                    {/* Buttons */}

                    <div className="mt-5 flex items-center gap-4">

                      <Link
                        to={`/jobs/${job.id}`}
                        className="text-sm font-semibold text-blue-600 hover:underline"
                      >
                        View Details
                      </Link>

                      <Link
                        to={`/edit-job/${job.id}`}
                        className="text-sm font-semibold text-slate-600 hover:text-blue-600"
                      >
                        Edit
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleDelete(job.id)}
                        className="text-sm font-semibold text-red-600 hover:text-red-700"
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                ))}

              </div>
            )}

          </div>

          {/* ================= QUICK ACTIONS ================= */}

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

            <h2 className="text-lg font-bold text-slate-900 mb-6">
              Quick Actions
            </h2>

            <div className="space-y-3">

              {/* Post Job */}

              <Link
                to="/create-job"
                className="block w-full px-4 py-3 rounded-lg bg-slate-50 hover:bg-blue-50 text-sm font-medium text-slate-700 hover:text-blue-600 transition"
              >
                Post a Job
              </Link>

              {/* Applications */}

              <Link
                to="/employer-applications"
                className="block w-full px-4 py-3 rounded-lg bg-slate-50 hover:bg-blue-50 text-sm font-medium text-slate-700 hover:text-blue-600 transition"
              >
                View Applications
              </Link>

              {/* Manage Jobs */}

              <Link
                to="/employer-jobs"
                className="block w-full px-4 py-3 rounded-lg bg-slate-50 hover:bg-blue-50 text-sm font-medium text-slate-700 hover:text-blue-600 transition"
              >
                Manage Jobs
              </Link>

              {/* Company Profile */}

              <Link
                to="/company-profile"
                className="block w-full px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold text-center transition"
              >
                Complete Profile
              </Link>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
};

export default EmployerDashboard;