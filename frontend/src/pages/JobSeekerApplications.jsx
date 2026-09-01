import { useEffect, useState } from "react";
import api from "../lib/axios";

const JobSeekerApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login first.");
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(
          "/applications",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        setApplications(response.data);
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

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-slate-600">
          Loading applications...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100">

      {/* NAVBAR */}
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
              Find Jobs
            </Link>

          </div>
        </div>
      </nav>

      {/* MAIN */}
      <section className="max-w-5xl mx-auto px-4 md:px-8 py-8">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            My Applications
          </h1>

          <p className="mt-2 text-slate-600">
            Track the jobs you have applied for.
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">
            {error}
          </div>
        )}

        {/* EMPTY */}
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
              Find Jobs
            </Link>

          </div>
        )}

        {/* APPLICATIONS */}
        {!error && applications.length > 0 && (
          <div className="space-y-5">

            {applications.map((application) => (

              <div
                key={application.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
              >

                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

                  <div>

                    <h2 className="text-xl font-bold text-slate-900">
                      {application.job?.title || "Job"}
                    </h2>

                    <p className="mt-1 text-sm font-medium text-blue-600">
                      {application.job?.company?.name ||
                        "Company"}
                    </p>

                    <p className="mt-3 text-sm text-slate-500">
                      📍{" "}
                      {application.job?.location ||
                        "Location not specified"}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      💰 PKR{" "}
                      {application.job?.salary ||
                        "Not specified"}
                    </p>

                  </div>

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

              </div>

            ))}

          </div>
        )}

      </section>
    </main>
  );
};

export default JobSeekerApplications;