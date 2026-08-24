
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const Jobs = () => {
  // Search input ki value yahan store hogi
  const [search, setSearch] = useState("");

  // Location input ki value yahan store hogi
  const [location, setLocation] = useState("");

  // Backend se aane wali jobs yahan store hongi
  const [jobs, setJobs] = useState([]);

  // Jab tak API se data aa raha hai loading true rahega
  const [loading, setLoading] = useState(true);

  // Agar API request fail ho jaye to error yahan store hoga
  const [error, setError] = useState("");

  // Component load hote hi Laravel backend se jobs fetch karenge
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/jobs")
      .then((response) => {
        // Backend se jo jobs ayi hain unko state mein save kar rahe hain
        setJobs(response.data);

        console.log("Jobs from backend:", response.data);
      })
      .catch((error) => {
        // Agar API mein koi problem aaye
        console.error("Error fetching jobs:", error);

        setError("Unable to load jobs. Please try again.");
      })
      .finally(() => {
        // API request complete hone ke baad loading khatam
        setLoading(false);
      });
  }, []);

  // Search aur location ke according jobs filter hongi
  const filteredJobs = jobs.filter((job) => {
    const jobTitle = job.title?.toLowerCase() || "";
    const jobLocation = job.location?.toLowerCase() || "";

    return (
      jobTitle.includes(search.toLowerCase()) &&
      jobLocation.includes(location.toLowerCase())
    );
  });

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

      {/* ================= MAIN CONTENT ================= */}

      <section className="max-w-7xl mx-auto px-4 md:px-8 py-8">

        {/* Page heading */}
        <div className="mb-8">

          <h1 className="text-3xl font-bold text-slate-900">
            Find Jobs
          </h1>

          <p className="mt-2 text-slate-600">
            Search and discover opportunities that match your skills.
          </p>

        </div>

        {/* ================= SEARCH ================= */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-8">

          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3">

            {/* Job title search */}
            <input
              type="text"
              placeholder="Job title, keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-sm text-slate-900 bg-white outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"
            />

            {/* Location search */}
            <input
              type="text"
              placeholder="Location..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-sm text-slate-900 bg-white outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"
            />

            {/* Search button */}
            <button
              type="button"
              className="px-6 py-3 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
            >
              Search
            </button>

          </div>
        </div>

        {/* ================= JOBS SECTION ================= */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Jobs list */}
          <div className="lg:col-span-2 space-y-4">

            {/* Heading */}
            <div className="flex items-center justify-between">

              <h2 className="text-lg font-bold text-slate-900">
                Available Jobs
              </h2>

              {!loading && !error && (
                <p className="text-sm text-slate-500">
                  {filteredJobs.length} jobs found
                </p>
              )}

            </div>

            {/* ================= LOADING ================= */}

            {loading && (
              <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">

                <p className="text-sm text-slate-500">
                  Loading jobs...
                </p>

              </div>
            )}

            {/* ================= ERROR ================= */}

            {!loading && error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">

                <p className="text-sm text-red-600">
                  {error}
                </p>

              </div>
            )}

            {/* ================= JOB CARDS ================= */}

            {!loading && !error && filteredJobs.length > 0 && (
              filteredJobs.map((job) => (

                <div
                  key={job.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition"
                >

                  {/* Job title */}
                  <h3 className="text-lg font-bold text-slate-900">
                    {job.title}
                  </h3>

                  {/* Company name */}
                  <p className="mt-1 text-sm font-medium text-blue-600">
                    {job.company?.name || "Company"}
                  </p>

                  {/* Location */}
                  <p className="mt-3 text-sm text-slate-500">
                    📍 {job.location}
                  </p>

                  {/* Salary */}
                  <p className="mt-1 text-sm text-slate-500">
                    💰 PKR {job.salary}
                  </p>

                  {/* Job status */}
                  <p className="mt-1 text-sm text-slate-500">
                    Status: {job.status}
                  </p>

                  {/* Bottom buttons */}
                  <div className="mt-5">

                    {/* Job details page par jayega */}
                    <Link
                      to={`/jobs/${job.id}`}
                      className="inline-block text-sm font-semibold text-blue-600 hover:underline"
                    >
                      View Details →
                    </Link>

                  </div>

                </div>

              ))
            )}

            {/* ================= NO JOBS ================= */}

            {!loading && !error && filteredJobs.length === 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">

                <p className="text-slate-500 text-sm">
                  No jobs found.
                </p>

                {/* Search clear karne ka option */}
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setLocation("");
                  }}
                  className="mt-4 text-sm font-semibold text-blue-600 hover:underline"
                >
                  Clear Search
                </button>

              </div>
            )}

          </div>

          {/* ================= FILTER SIDEBAR ================= */}

          <aside className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 h-fit">

            <h2 className="text-lg font-bold text-slate-900 mb-5">
              Job Filters
            </h2>

            <div className="space-y-4">

              {/* Job Type */}
              <div>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Job Type
                </label>

                <select
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 bg-white outline-none focus:border-blue-600"
                >
                  <option>All Types</option>
                  <option>Full Time</option>
                  <option>Part Time</option>
                  <option>Remote</option>
                  <option>Internship</option>
                </select>

              </div>

              {/* Experience */}
              <div>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Experience
                </label>

                <select
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 bg-white outline-none focus:border-blue-600"
                >
                  <option>Any Experience</option>
                  <option>Entry Level</option>
                  <option>1-2 Years</option>
                  <option>3-5 Years</option>
                  <option>5+ Years</option>
                </select>

              </div>

              {/* Clear filters */}
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setLocation("");
                }}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Clear Filters
              </button>

            </div>
          </aside>

        </div>
      </section>
    </main>
  );
};

export default Jobs;