import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/axios";

const EmployerJobs = () => {
  // Backend se jobs yahan store hongi
  const [jobs, setJobs] = useState([]);

  // Loading state
  const [loading, setLoading] = useState(true);

  // Error message
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // ==========================================
  // JOBS BACKEND SE GET KARNA
  // ==========================================

  useEffect(() => {
    const fetchJobs = async () => {
      try {
       const token = localStorage.getItem("token");

const response = await api.get(
  "/my-jobs",
  {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  }
);

        // Backend se jobs aa gayi
        setJobs(response.data);

      } catch (error) {
        console.log("Jobs Error:", error);

        setError(
          "Jobs load nahi ho sakin."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // ==========================================
  // DELETE JOB
  // ==========================================

  const deleteJob = async (jobId) => {
    // Delete se pehle confirmation
    const confirmDelete = window.confirm(
      "Kya aap ye job delete karna chahti hain?"
    );

    if (!confirmDelete) {
      return;
    }

    const token = localStorage.getItem("token");

    try {
      await api.delete(
        `/jobs/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      // Delete hone ke baad frontend list se bhi remove
      setJobs((previousJobs) =>
        previousJobs.filter(
          (job) => job.id !== jobId
        )
      );

      alert("Job successfully delete ho gayi.");

    } catch (error) {
      console.log("Delete Job Error:", error);

      alert(
        error.response?.data?.message ||
          "Job delete nahi ho saki."
      );
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-slate-600">
          Loading jobs...
        </p>
      </main>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <main className="min-h-screen bg-slate-100">

      {/* ================= NAVBAR ================= */}

      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">

          <Link
            to="/employer-dashboard"
            className="text-xl font-bold text-blue-600"
          >
            JobPortal
          </Link>

          <div className="flex items-center gap-4">

            <Link
              to="/employer-dashboard"
              className="text-sm font-medium text-slate-700 hover:text-blue-600"
            >
              Dashboard
            </Link>

            <Link
              to="/employer-applications"
              className="text-sm font-medium text-slate-700 hover:text-blue-600"
            >
              Applications
            </Link>

          </div>
        </div>
      </nav>

      {/* ================= MAIN ================= */}

      <section className="max-w-7xl mx-auto px-4 md:px-8 py-8">

        {/* HEADER */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

          <div>

            <h1 className="text-3xl font-bold text-slate-900">
              My Jobs
            </h1>

            <p className="mt-2 text-slate-600">
              Manage the jobs you have posted.
            </p>

          </div>

          {/* Create Job button */}

          <Link
            to="/create-job"
            className="px-5 py-3 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition text-center"
          >
            + Create Job
          </Link>

        </div>

        {/* ERROR */}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">
            {error}
          </div>
        )}

        {/* NO JOBS */}

        {!error && jobs.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 text-center">

            <h2 className="text-lg font-bold text-slate-900">
              No Jobs Yet
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              You haven't created any jobs yet.
            </p>

            <Link
              to="/create-job"
              className="inline-block mt-5 px-6 py-3 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
            >
              Create Your First Job
            </Link>

          </div>
        )}

        {/* JOB LIST */}

        {jobs.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {jobs.map((job) => (

              <div
                key={job.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
              >

                {/* Job title */}

                <div className="flex items-start justify-between gap-4">

                  <div>

                    <h2 className="text-xl font-bold text-slate-900">
                      {job.title}
                    </h2>

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

                <div className="mt-5 space-y-2">

                  <p className="text-sm text-slate-500">
                    📍 {job.location || "Location not specified"}
                  </p>

                  <p className="text-sm text-slate-500">
                    💰 PKR {job.salary}
                  </p>

                </div>

                {/* Description */}

                <p className="mt-4 text-sm text-slate-600 line-clamp-3">
                  {job.description}
                </p>

                {/* ACTIONS */}

                <div className="mt-6 pt-5 border-t border-slate-200 flex flex-wrap gap-3">

                  {/* View */}

                  <Link
                    to={`/jobs/${job.id}`}
                    className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    View
                  </Link>

                  {/* Edit */}

                  <Link
                    to={`/edit-job/${job.id}`}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
                  >
                    Edit
                  </Link>

                  {/* Delete */}

                  <button
                    type="button"
                    onClick={() => deleteJob(job.id)}
                    className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700"
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))}

          </div>
        )}

      </section>
    </main>
  );
};

export default EmployerJobs;