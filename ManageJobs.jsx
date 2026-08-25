import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const ManageJobs = () => {

  // Backend se jobs store karne ke liye
  const [jobs, setJobs] = useState([]);

  // Loading ke liye
  const [loading, setLoading] = useState(true);

  // ==================================================
  // Employer ki jobs backend se load karna
  // ==================================================

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {

      // Login ke waqt save hua token
      const token = localStorage.getItem("token");

      // Backend se current employer ki jobs mangwa rahe hain
      const response = await axios.get(
        "http://localhost:8000/api/my-jobs",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      // Jobs state mein save
      setJobs(response.data);

    } catch (error) {

      console.error("Error fetching jobs:", error);

      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Unable to load jobs.");
      }

    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // Job delete karna
  // ==================================================

  const handleDelete = async (id) => {

    // Delete se pehle confirmation
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmDelete) {
      return;
    }

    try {

      const token = localStorage.getItem("token");

      // Backend delete API
      await axios.delete(
        `http://localhost:8000/api/jobs/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      alert("Job deleted successfully.");

      // Delete ke baad list dobara load
      fetchJobs();

    } catch (error) {

      console.error("Delete Job Error:", error);

      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Unable to delete job.");
      }

    }
  };

  return (
    <main className="min-h-screen bg-slate-100">

      {/* ==================================================
          NAVBAR
      ================================================== */}

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
              to="/create-job"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
            >
              Post New Job
            </Link>

          </div>
        </div>
      </nav>


      {/* ==================================================
          MAIN CONTENT
      ================================================== */}

      <section className="max-w-7xl mx-auto px-4 md:px-8 py-8">

        {/* Heading */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

          <div>

            <h1 className="text-3xl font-bold text-slate-900">
              Manage Jobs
            </h1>

            <p className="mt-2 text-slate-600">
              View and manage your posted jobs.
            </p>

          </div>

          <Link
            to="/create-job"
            className="px-5 py-3 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 text-center"
          >
            + Post New Job
          </Link>

        </div>


        {/* ==================================================
            LOADING
        ================================================== */}

        {loading && (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
            <p className="text-slate-500">
              Loading jobs...
            </p>
          </div>
        )}


        {/* ==================================================
            NO JOBS
        ================================================== */}

        {!loading && jobs.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">

            <h2 className="text-xl font-bold text-slate-900">
              No jobs posted yet
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Start by creating your first job posting.
            </p>

            <Link
              to="/create-job"
              className="inline-block mt-5 px-5 py-3 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
            >
              Create Job
            </Link>

          </div>
        )}


        {/* ==================================================
            JOBS LIST
        ================================================== */}

        {!loading && jobs.length > 0 && (
          <div className="space-y-4">

            {jobs.map((job) => (

              <div
                key={job.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
              >

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                  {/* Job Information */}

                  <div>

                    <h2 className="text-xl font-bold text-slate-900">
                      {job.title}
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                      📍 {job.location || "Location not specified"}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      💰 PKR {job.salary}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Posted on{" "}
                      {new Date(job.created_at).toLocaleDateString()}
                    </p>

                  </div>


                  {/* Status */}

                  <div>

                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        job.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {job.status}
                    </span>

                  </div>


                  {/* Actions */}

                  <div className="flex items-center gap-3">

                    {/* Details */}

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
                      onClick={() => handleDelete(job.id)}
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

export default ManageJobs;