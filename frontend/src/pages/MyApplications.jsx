import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const MyApplications = () => {
  // Backend se applications yahan store hongi
  const [applications, setApplications] = useState([]);

  // Loading state
  const [loading, setLoading] = useState(true);

  // Error state
  const [error, setError] = useState("");

  // =====================================
  // APPLICATIONS BACKEND SE GET KARNA
  // =====================================

  useEffect(() => {
    const fetchApplications = async () => {
      // Login ke waqt save kiya hua token
      const token = localStorage.getItem("token");

      // Token nahi hai to API call nahi karni
      if (!token) {
        setError("Please login first.");
        setLoading(false);
        return;
      }

      try {
        // Laravel backend se applications lena
        const response = await axios.get(
          "http://localhost:8000/api/applications",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        // Backend ka data state mein save
        setApplications(response.data);

      } catch (error) {
        console.log("Applications Error:", error);

        setError(
          error.response?.data?.message ||
            "Unable to load applications."
        );
      } finally {
        // Loading complete
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-slate-600">
          Loading applications...
        </p>
      </main>
    );
  }

  // =====================================
  // PAGE
  // =====================================

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
              to="/job-seeker-dashboard"
              className="text-sm font-medium text-slate-700 hover:text-blue-600"
            >
              Dashboard
            </Link>

            <Link
              to="/jobs"
              className="text-sm font-medium text-slate-700 hover:text-blue-600"
            >
              Jobs
            </Link>

          </div>
        </div>
      </nav>

      {/* ================= MAIN ================= */}

      <section className="max-w-7xl mx-auto px-4 md:px-8 py-8">

        {/* Heading */}

        <div className="mb-8">

          <h1 className="text-3xl font-bold text-slate-900">
            My Applications
          </h1>

          <p className="mt-2 text-slate-600">
            Track the jobs you have applied for.
          </p>

        </div>

        {/* ================= ERROR ================= */}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">
            {error}
          </div>
        )}

        {/* ================= NO APPLICATIONS ================= */}

        {!error && applications.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 text-center">

            <h2 className="text-lg font-bold text-slate-900">
              No Applications Yet
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              You haven't applied for any jobs yet.
            </p>

            <Link
              to="/jobs"
              className="inline-block mt-5 px-6 py-3 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
            >
              Browse Jobs
            </Link>

          </div>
        )}

        {/* ================= APPLICATION LIST ================= */}

        {applications.length > 0 && (
          <div className="space-y-4">

            {applications.map((application) => {

              // Backend mein job relation ka naam job hai
              const job = application.job;

              return (
                <div
                  key={application.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
                >

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                    {/* JOB INFORMATION */}

                    <div>

                      <h2 className="text-xl font-bold text-slate-900">
                        {job?.title || "Job"}
                      </h2>

                      <p className="mt-1 text-sm font-semibold text-blue-600">
                        {job?.company?.name || "Company"}
                      </p>

                      <div className="mt-3 space-y-1">

                        <p className="text-sm text-slate-500">
                          📍 {job?.location || "Not specified"}
                        </p>

                        <p className="text-sm text-slate-500">
                          💰 PKR {job?.salary || "Not specified"}
                        </p>

                      </div>

                    </div>

                    {/* APPLICATION STATUS */}

                    <div className="text-left md:text-right">

                      <p className="text-xs text-slate-500 mb-2">
                        Application Status
                      </p>

                      <span
                        className={`inline-block px-4 py-2 rounded-full text-sm font-semibold
                          ${
                            application.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : application.status === "accepted"
                              ? "bg-green-100 text-green-700"
                              : application.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-slate-100 text-slate-700"
                          }
                        `}
                      >
                        {application.status}
                      </span>

                    </div>

                  </div>

                  {/* VIEW JOB */}

                  {job?.id && (
                    <div className="mt-5 pt-5 border-t border-slate-200">

                      <Link
                        to={`/jobs/${job.id}`}
                        className="text-sm font-semibold text-blue-600 hover:underline"
                      >
                        View Job Details →
                      </Link>

                    </div>
                  )}

                </div>
              );
            })}

          </div>
        )}

      </section>
    </main>
  );
};

export default MyApplications;