import { Link } from "react-router-dom";

const EmployerDashboard = () => {
  return (
    <main className="min-h-screen bg-slate-100">
      {/* Navbar */}
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
              to="/profile"
              className="text-sm font-medium text-slate-700 hover:text-blue-600 transition"
            >
              Profile
            </Link>

            <button
              type="button"
              className="text-sm font-medium text-slate-700 hover:text-red-600 transition"
            >
              Logout
            </button>
            <Link
  to="/create-job"
  className="block w-full px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold text-center transition"
>
  Post a New Job
</Link>
          </div>
        </div>
      </nav>

      {/* Main */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            Welcome back, Employer!
          </h1>

          <p className="mt-2 text-slate-600">
            Manage your jobs and find the right candidates for your company.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <p className="text-sm text-slate-500">Posted Jobs</p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">0</h2>

            <p className="mt-2 text-sm text-slate-500">
              Jobs currently posted
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <p className="text-sm text-slate-500">Applications</p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">0</h2>

            <p className="mt-2 text-sm text-slate-500">
              Applications received
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <p className="text-sm text-slate-500">Company Profile</p>

            <h2 className="mt-2 text-3xl font-bold text-blue-600">0%</h2>

            <p className="mt-2 text-sm text-slate-500">
              Complete your company profile
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Jobs */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">
                Your Jobs
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
                You haven't posted any jobs yet.
              </p>

              <button
                type="button"
                className="mt-4 px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
              >
                Post a Job
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
                Post a Job
              </button>

           <Link
  to="/employer-applications"
  className="block w-full text-left px-4 py-3 rounded-lg bg-slate-50 hover:bg-blue-50 text-sm font-medium text-slate-700 hover:text-blue-600 transition"
>
  View Applications
</Link>

             <Link
  to="/employer-jobs"
  className="block w-full text-left px-4 py-3 rounded-lg bg-slate-50 hover:bg-blue-50 text-sm font-medium text-slate-700 hover:text-blue-600 transition"
>
  Manage Jobs
</Link>
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

export default EmployerDashboard;
