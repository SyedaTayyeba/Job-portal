import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const EmployerApplications = () => {
  // Backend se applications yahan save hongi
  const [applications, setApplications] = useState([]);

  // Loading ke liye
  const [loading, setLoading] = useState(true);

  // Error message ke liye
  const [error, setError] = useState("");

  // Company ID
  const [companyId, setCompanyId] = useState(null);

  // ==========================================
  // EMPLOYER KI COMPANY FIND KARNA
  // ==========================================

  useEffect(() => {
    const fetchCompanyAndApplications = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login first.");
        setLoading(false);
        return;
      }

      try {
        // Pehle employer ki companies get karte hain
        const companyResponse = await axios.get(
          "http://localhost:8000/api/companies",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        // Backend response
        const companies = companyResponse.data;

        // Pehli company temporarily select kar rahe hain.
        // Agar employer ki multiple companies hain to baad mein dropdown bana sakte hain.
        const company = companies[0];

        if (!company) {
          setError("No company found for this employer.");
          setLoading(false);
          return;
        }

        // Company ID save
        setCompanyId(company.id);

        // ==========================================
        // COMPANY KI APPLICATIONS GET KARNA
        // ==========================================

        const applicationResponse = await axios.get(
          `http://localhost:8000/api/company/${company.id}/applications`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        setApplications(applicationResponse.data);

      } catch (error) {
        console.log("Employer Applications Error:", error);

        setError(
          error.response?.data?.message ||
            "Unable to load applications."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyAndApplications();
  }, []);

  // ==========================================
  // APPLICATION STATUS CHANGE
  // ==========================================

  const updateStatus = async (applicationId, status) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login first.");
      return;
    }

    try {
      await axios.put(
        `http://localhost:8000/api/applications/${applicationId}/status`,
        {
          status: status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      // Status successfully update hone ke baad
      // frontend state bhi update kar dete hain.
      setApplications((previousApplications) =>
        previousApplications.map((application) =>
          application.id === applicationId
            ? {
                ...application,
                status: status,
              }
            : application
        )
      );

    } catch (error) {
      console.log("Update Status Error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to update application status."
      );
    }
  };

  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-slate-600">
          Loading applications...
        </p>
      </main>
    );
  }

  // ==========================================
  // MAIN PAGE
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
              to="/jobs"
              className="text-sm font-medium text-slate-700 hover:text-blue-600"
            >
              Jobs
            </Link>

          </div>
        </div>
      </nav>

      {/* ================= CONTENT ================= */}

      <section className="max-w-7xl mx-auto px-4 md:px-8 py-8">

        {/* Heading */}

        <div className="mb-8">

          <h1 className="text-3xl font-bold text-slate-900">
            Job Applications
          </h1>

          <p className="mt-2 text-slate-600">
            Review applications submitted for your jobs.
          </p>

        </div>

        {/* Error */}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">
            {error}
          </div>
        )}

        {/* No applications */}

        {!error && applications.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 text-center">

            <h2 className="text-lg font-bold text-slate-900">
              No Applications Yet
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              No one has applied to your jobs yet.
            </p>

          </div>
        )}

        {/* Applications */}

        {applications.length > 0 && (
          <div className="space-y-5">

            {applications.map((application) => {

              // Backend se job relation
              const job = application.job;

              // Backend se applicant/user relation
              const applicant =
                application.user || application.applicant;

              return (
                <div
                  key={application.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
                >

                  {/* TOP */}

                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">

                    {/* Applicant */}

                    <div>

                      <p className="text-xs font-semibold text-slate-500 uppercase">
                        Applicant
                      </p>

                      <h2 className="mt-1 text-xl font-bold text-slate-900">
                        {applicant?.name || "Applicant"}
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        {applicant?.email || "Email not available"}
                      </p>

                    </div>

                    {/* Status */}

                    <div>

                      <span
                        className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                          application.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : application.status === "accepted"
                            ? "bg-green-100 text-green-700"
                            : application.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {application.status || "pending"}
                      </span>

                    </div>

                  </div>

                  {/* JOB */}

                  <div className="mt-6 pt-5 border-t border-slate-200">

                    <p className="text-xs font-semibold text-slate-500 uppercase">
                      Applied For
                    </p>

                    <h3 className="mt-1 text-lg font-bold text-blue-600">
                      {job?.title || "Job"}
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                      📍 {job?.location || "Location not available"}
                    </p>

                  </div>

                  {/* ACTIONS */}

                  <div className="mt-6 flex flex-wrap gap-3">

                    {/* Accept */}

                    <button
                      type="button"
                      onClick={() =>
                        updateStatus(application.id, "accepted")
                      }
                      disabled={application.status === "accepted"}
                      className="px-5 py-2.5 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Accept
                    </button>

                    {/* Reject */}

                    <button
                      type="button"
                      onClick={() =>
                        updateStatus(application.id, "rejected")
                      }
                      disabled={application.status === "rejected"}
                      className="px-5 py-2.5 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Reject
                    </button>

                    {/* Pending */}

                    <button
                      type="button"
                      onClick={() =>
                        updateStatus(application.id, "pending")
                      }
                      disabled={application.status === "pending"}
                      className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Set Pending
                    </button>

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </section>
    </main>
  );
};

export default EmployerApplications;