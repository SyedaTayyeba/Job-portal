import { Link } from "react-router-dom";

const JobSeekerDashboard = () => {
  return (
    <main className="min-h-screen bg-slate-100">
      {/* Navbar */}
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
              to="/profile"
              className="text-sm font-medium text-slate-700 hover:text-blue-600 transition"
            >
              Profile
            </Link>

            <button
              className="text-sm font-medium text-slate-700 hover:text-red-600 transition"
              type="button"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            Welcome back!
          </h1>

          <p className="mt-2 text-slate-600">
            Find your next opportunity and keep track of your applications.
          </p>
        </div>

        {/* Search */}
        <div className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-slate-200 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3">
            <input
              type="text"
              placeholder="Job title, keywords..."
              className="w-full px-4 py-3 rounded-lg text-sm text-slate-900 bg-white outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"
            />

            <input
              type="text"
              placeholder="Location"
              className="w-full px-4 py-3 rounded-lg text-sm text-slate-900 bg-white outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"
            />

            <button
              type="button"
              className="px-6 py-3 rounded-lg bg-blue-600 text-white text-sm font-semibold border border-blue-600 hover:bg-blue-700 transition cursor-pointer"
            >
              Search Jobs
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <p className="text-sm text-slate-500">
              Applications
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              0
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Jobs you've applied to
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <p className="text-sm text-slate-500">
              Saved Jobs
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              0
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Jobs saved for later
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <p className="text-sm text-slate-500">
              Profile
            </p>

            <h2 className="mt-2 text-3xl font-bold text-blue-600">
              0%
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Complete your profile
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Latest Jobs */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">
                Latest Jobs
              </h2>

              <button
                type="button"
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                View all
              </button>
            </div>

            <div className="text-center py-12">
              <p className="text-slate-500 text-sm">
                No jobs available yet.
              </p>

              <button
                type="button"
                className="mt-4 text-sm font-semibold text-blue-600 hover:underline"
              >
                Browse Jobs
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-6">
              Quick Actions
            </h2>

            <div className="space-y-3">
              <button
                type="button"
                className="w-full text-left px-4 py-3 rounded-lg bg-slate-50 hover:bg-blue-50 text-sm font-medium text-slate-700 hover:text-blue-600 transition"
              >
                Search for Jobs
              </button>

              <button
                type="button"
                className="w-full text-left px-4 py-3 rounded-lg bg-slate-50 hover:bg-blue-50 text-sm font-medium text-slate-700 hover:text-blue-600 transition"
              >
                View Applications
              </button>

              <button
                type="button"
                className="w-full text-left px-4 py-3 rounded-lg bg-slate-50 hover:bg-blue-50 text-sm font-medium text-slate-700 hover:text-blue-600 transition"
              >
                Saved Jobs
              </button>

              <Link
                to="/profile"
                className="block w-full px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold text-center transition"
              >
                Complete Profile
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default JobSeekerDashboard;