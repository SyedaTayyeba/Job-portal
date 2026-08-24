import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const JobDetails = () => {
  // URL se job ki ID milegi
  // Example: /jobs/1 -> id = 1
  const { id } = useParams();

  // Backend se aane wali job ko yahan store karenge
  const [job, setJob] = useState(null);

  // Loading ke liye state
  const [loading, setLoading] = useState(true);

  // Error message ke liye state
  const [error, setError] = useState("");

  // Page load hote hi backend se job details fetch hongi
  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/jobs/${id}`)
      .then((response) => {
        console.log("Job details:", response.data);

        // Backend se job state mein save
        setJob(response.data);

        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching job:", error);

        setError("Unable to load job details.");
        setLoading(false);
      });
  }, [id]);

  // Apply button filhal UI hai
  // Apply API hum next step mein connect karenge
  const handleApply = () => {
    alert("Apply feature will be connected next.");
  };

  // Jab backend response aa raha ho
  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-slate-600">Loading job details...</p>
      </main>
    );
  }

  // Agar backend se error aaye
  if (error) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
          <p className="text-red-600">{error}</p>

          <Link
            to="/jobs"
            className="inline-block mt-4 text-sm font-semibold text-blue-600 hover:underline"
          >
            Back to Jobs
          </Link>
        </div>
      </main>
    );
  }

  // Agar job nahi mili
  if (!job) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-slate-600">Job not found.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100">
      {/* ================= NAVBAR ================= */}

      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">

          {/* Logo */}
          <Link
            to="/job-seeker-dashboard"
            className="text-xl font-bold text-blue-600"
          >
            JobPortal
          </Link>

          {/* Navbar links */}
          <div className="flex items-center gap-4">
            <Link
              to="/jobs"
              className="text-sm font-medium text-slate-700 hover:text-blue-600 transition"
            >
              Jobs
            </Link>

            <Link
              to="/job-seeker-dashboard"
              className="text-sm font-medium text-slate-700 hover:text-blue-600 transition"
            >
              Dashboard
            </Link>

            <Link
              to="/profile"
              className="text-sm font-medium text-slate-700 hover:text-blue-600 transition"
            >
              Profile
            </Link>
          </div>
        </div>
      </nav>

      {/* ================= MAIN ================= */}

      <section className="max-w-5xl mx-auto px-4 md:px-8 py-8">

        {/* Back button */}
        <Link
          to="/jobs"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          ← Back to Jobs
        </Link>

        {/* Job Header */}
        <div className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">

            <div>
              {/* Job title */}
              <h1 className="text-3xl font-bold text-slate-900">
                {job.title}
              </h1>

              {/* Company name */}
              <p className="mt-2 text-lg font-semibold text-blue-600">
                {job.company?.name || "Company"}
              </p>

              {/* Location */}
              <p className="mt-4 text-sm text-slate-500">
                📍 {job.location}
              </p>

              {/* Salary */}
              <p className="mt-2 text-sm text-slate-500">
                💰 PKR {job.salary}
              </p>

              {/* Status */}
              <p className="mt-2 text-sm text-slate-500">
                Status:{" "}
                <span
                  className={
                    job.status === "active"
                      ? "font-semibold text-green-600"
                      : "font-semibold text-red-600"
                  }
                >
                  {job.status}
                </span>
              </p>
            </div>

            {/* Apply button */}
            <button
              type="button"
              onClick={handleApply}
              disabled={job.status !== "active"}
              className={`px-6 py-3 rounded-lg text-sm font-semibold transition ${
                job.status === "active"
                  ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                  : "bg-slate-300 text-slate-500 cursor-not-allowed"
              }`}
            >
              {job.status === "active" ? "Apply Now" : "Job Closed"}
            </button>
          </div>
        </div>

        {/* ================= JOB DESCRIPTION ================= */}

        <div className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">

          <h2 className="text-xl font-bold text-slate-900">
            Job Description
          </h2>

          <p className="mt-4 text-slate-600 leading-7 whitespace-pre-line">
            {job.description}
          </p>
        </div>

        {/* ================= COMPANY ================= */}

        <div className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">

          <h2 className="text-xl font-bold text-slate-900">
            About the Company
          </h2>

          <p className="mt-4 text-slate-600">
            {job.company?.name || "Company information is not available."}
          </p>
        </div>

      </section>
    </main>
  );
};

export default JobDetails;