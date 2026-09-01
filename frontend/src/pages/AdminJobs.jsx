import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/axios";

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login first.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.get(
        "/admin/jobs",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      setJobs(response.data.jobs || response.data);
    } catch (error) {
      console.log("Jobs Error:", error);

      setError(
        error.response?.data?.message ||
          "Jobs could not be loaded."
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (id) => {
    const token = localStorage.getItem("token");

    if (!window.confirm("Are you sure you want to delete this job?")) {
      return;
    }

    try {
      await api.delete(
        `/admin/jobs/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      setJobs((previousJobs) =>
        previousJobs.filter((job) => job.id !== id)
      );
    } catch (error) {
      console.log("Delete Job Error:", error);

      setError(
        error.response?.data?.message ||
          "Job could not be deleted."
      );
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-slate-600">Loading jobs...</p>
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
            Manage Jobs
          </h1>

          <p className="mt-2 text-slate-600">
            Review and manage jobs posted by employers.
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
            {error}
          </div>
        )}

        {!error && jobs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
            <h2 className="text-lg font-bold text-slate-900">
              No Jobs Found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              There are no jobs available.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {job.title || "Untitled Job"}
                    </h2>

                    <p className="mt-1 text-sm font-medium text-blue-600">
                      {job.company?.name ||
                        job.company_name ||
                        "Company"}
                    </p>

                    <p className="mt-3 text-sm text-slate-500">
                      📍 {job.location || "Location not specified"}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      💰 PKR {job.salary || "Not specified"}
                    </p>

                    <p className="mt-2 text-sm text-slate-500">
                      Posted by:{" "}
                      {job.company?.user?.name ||
                        job.user?.name ||
                        "Employer"}
                    </p>
                  </div>

                  <div className="flex flex-col items-start md:items-end gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        job.status === "active"
                          ? "bg-green-100 text-green-700"
                          : job.status === "closed"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {job.status || "N/A"}
                    </span>

                    <button
                      type="button"
                      onClick={() => deleteJob(job.id)}
                      className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default AdminJobs;