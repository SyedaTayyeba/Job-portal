import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../lib/axios";

const JobDetails = () => {
  // URL se job ID le rahe hain
  // Example: /jobs/1 → id = 1
  const { id } = useParams();

  // Page change karne ke liye
  const navigate = useNavigate();

  // Job ka data yahan store hoga
  const [job, setJob] = useState(null);

  // Loading ke liye
  const [loading, setLoading] = useState(true);

  // Error message ke liye
  const [error, setError] = useState("");

  // Apply button ke waqt loading
  const [applying, setApplying] = useState(false);

  // ==============================
  // JOB BACKEND SE GET KARNA
  // ==============================

  useEffect(() => {
    api
      .get(`/jobs/${id}`)
      .then((response) => {
        // Backend se job receive hui
        setJob(response.data);

        // Loading khatam
        setLoading(false);
      })
      .catch((error) => {
        console.log("Error fetching job:", error);

        setError("Job not found.");
        setLoading(false);
      });
  }, [id]);

  // ==============================
  // APPLY JOB
  // ==============================

  const handleApply = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first.");
      return;
    }

    try {
      await api.post(
        "/apply",
        {
          job_id: job.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      alert("Application submitted successfully.");
    } catch (error) {
      console.log("Apply Error:", error);

      alert(
        error.response?.data?.message || "Application submit nahi ho saki.",
      );
    }
  };

  // ==============================
  // LOADING SCREEN
  // ==============================

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-slate-600">Loading job...</p>
      </main>
    );
  }

  // ==============================
  // ERROR SCREEN
  // ==============================

  if (error || !job) {
    return (
      <main className="min-h-screen bg-slate-100">
        <div className="max-w-3xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Job Not Found</h1>

          <p className="mt-2 text-slate-500">
            This job does not exist or has been removed.
          </p>

          <Link
            to="/jobs"
            className="inline-block mt-6 px-5 py-3 rounded-lg bg-blue-600 text-white font-semibold"
          >
            Back to Jobs
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100">
      {/* ================= NAVBAR ================= */}

      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <Link
            to="/job-seeker-dashboard"
            className="text-xl font-bold text-blue-600"
          >
            JobPortal
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to="/jobs"
              className="text-sm font-medium text-slate-700 hover:text-blue-600"
            >
              Jobs
            </Link>

            <Link
              to="/job-seeker-dashboard"
              className="text-sm font-medium text-slate-700 hover:text-blue-600"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* ================= MAIN ================= */}

      <section className="max-w-5xl mx-auto px-4 md:px-8 py-10">
        {/* Back button */}

        <Link
          to="/jobs"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          ← Back to Jobs
        </Link>

        {/* Job Card */}

        <div className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
          {/* Job title */}

          <h1 className="text-3xl font-bold text-slate-900">{job.title}</h1>

          {/* Company */}

          <p className="mt-2 text-lg font-semibold text-blue-600">
            {job.company?.name || "Company"}
          </p>

          {/* Basic information */}

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs text-slate-500">Location</p>

              <p className="mt-1 font-semibold text-slate-800">
                📍 {job.location || "Not specified"}
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs text-slate-500">Salary</p>

              <p className="mt-1 font-semibold text-slate-800">
                💰 PKR {job.salary}
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs text-slate-500">Status</p>

              <p className="mt-1 font-semibold text-green-600">{job.status}</p>
            </div>
          </div>

          {/* Description */}

          <div className="mt-8">
            <h2 className="text-xl font-bold text-slate-900">
              Job Description
            </h2>

            <p className="mt-3 text-slate-600 leading-7 whitespace-pre-line">
              {job.description}
            </p>
          </div>

          {/* Apply */}

          <div className="mt-8 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={handleApply}
              disabled={job.status !== "active"}
              className="px-6 py-3 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              {job.status === "active" ? "Apply Now" : "Job Closed"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default JobDetails;
