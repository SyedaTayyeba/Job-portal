import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const EmployerApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Employer ki company ID
  const [companyId, setCompanyId] = useState(null);

  // =====================================================
  // COMPANY + APPLICATIONS LOAD
  // =====================================================

  useEffect(() => {
    const fetchApplications = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login first.");
        setLoading(false);
        return;
      }

      try {
        // Pehle current user ki company nikalenge
        const companyResponse = await axios.get(
          "http://localhost:8000/api/companies"
        );

        const companies = companyResponse.data;

        // Current employer ki company
        const user = JSON.parse(localStorage.getItem("user"));

        const myCompany = companies.find(
          (company) => company.user_id === user?.id
        );

        if (!myCompany) {
          setError(
            "Company profile complete nahi hai. Pehle company profile create karein."
          );
          setLoading(false);
          return;
        }

        setCompanyId(myCompany.id);

        // Company ki applications
        const applicationsResponse = await axios.get(
          `http://localhost:8000/api/company/${myCompany.id}/applications`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        setApplications(applicationsResponse.data);
      } catch (error) {
        console.log("Applications Error:", error);

        setError(
          error.response?.data?.message ||
            "Applications load nahi ho sakin."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // =====================================================
  // ACCEPT / REJECT APPLICATION
  // =====================================================

  const updateStatus = async (applicationId, status) => {
    const token = localStorage.getItem("token");

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

      // Frontend list mein bhi status update
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

      alert(
        status === "accepted"
          ? "Application accepted."
          : "Application rejected."
      );
    } catch (error) {
      console.log("Update Status Error:", error);

      alert(
        error.response?.data?.message ||
          "Application status update nahi ho saka."
      );
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-slate-600">
          Loading applications...
        </p>
      </main>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <main className="min-h-screen bg-slate-100">

      {/* NAVBAR */}
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
              to="/employer-jobs"
              className="text-sm font-medium text-slate-700 hover:text-blue-600"
            >
              My Jobs
            </Link>

          </div>
        </div>
      </nav>

      {/* MAIN */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-8">

        {/* HEADER */}
        <div className="mb-8">

          <h1 className="text-3xl font-bold text-slate-900">
            Applications
          </h1>

          <p className="mt-2 text-slate-600">
            Review applications submitted for your jobs.
          </p>

        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">
            {error}
          </div>
        )}

        {/* NO APPLICATIONS */}
        {!error && applications.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 text-center">

            <h2 className="text-lg font-bold text-slate-900">
              No Applications Yet
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              You haven't received any applications yet.
            </p>

          </div>
        )}

        {/* APPLICATION LIST */}
        {!error && applications.length > 0 && (
          <div className="space-y-5">

            {applications.map((application) => (

              <div
                key={application.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
              >

                {/* TOP */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

                  <div>

                    {/* Applicant */}
                    <h2 className="text-xl font-bold text-slate-900">
                      {application.user?.name ||
                        "Applicant"}
                    </h2>

                    {/* Email */}
                    <p className="mt-1 text-sm text-slate-500">
                      {application.user?.email ||
                        "Email not available"}
                    </p>

                    {/* Job */}
                    <p className="mt-3 text-sm font-semibold text-blue-600">
                      Applied for:{" "}
                      {application.job?.title ||
                        "Job"}
                    </p>

                  </div>

                  {/* STATUS */}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold w-fit ${
                      application.status === "accepted"
                        ? "bg-green-100 text-green-700"
                        : application.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {application.status}
                  </span>

                </div>

                {/* JOB INFO */}
                <div className="mt-5 pt-5 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3">

                  <p className="text-sm text-slate-500">
                    📍{" "}
                    {application.job?.location ||
                      "Location not specified"}
                  </p>

                  <p className="text-sm text-slate-500">
                    💰 PKR{" "}
                    {application.job?.salary ||
                      "Not specified"}
                  </p>

                </div>

                {/* ACTIONS */}
                {application.status === "pending" && (
                  <div className="mt-6 flex flex-wrap gap-3">

                    <button
                      type="button"
                      onClick={() =>
                        updateStatus(
                          application.id,
                          "accepted"
                        )
                      }
                      className="px-5 py-2.5 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700"
                    >
                      Accept
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        updateStatus(
                          application.id,
                          "rejected"
                        )
                      }
                      className="px-5 py-2.5 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700"
                    >
                      Reject
                    </button>

                  </div>
                )}

              </div>

            ))}

          </div>
        )}

      </section>
    </main>
  );
};

export default EmployerApplications;