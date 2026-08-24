import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <main className="min-h-screen bg-slate-100">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <Link
            to="/admin-dashboard"
            className="text-xl font-bold text-blue-600"
          >
            JobPortal
          </Link>

          <div className="flex items-center gap-4">
            <button
              type="button"
              className="text-sm font-medium text-slate-700 hover:text-red-600 transition"
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
            Admin Dashboard
          </h1>

          <p className="mt-2 text-slate-600">
            Manage users, employers, jobs and the overall JobPortal system.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <p className="text-sm text-slate-500">Total Users</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">0</h2>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <p className="text-sm text-slate-500">Job Seekers</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">0</h2>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <p className="text-sm text-slate-500">Employers</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">0</h2>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <p className="text-sm text-slate-500">Jobs</p>
            <h2 className="mt-2 text-3xl font-bold text-blue-600">0</h2>
          </div>
        </div>

        {/* Management */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900">
              Manage Users
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              View and manage registered users.
            </p>

            <button
              type="button"
              className="mt-5 w-full px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition"
            >
              View Users
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900">
              Manage Jobs
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Review and manage jobs posted by employers.
            </p>

            <button
              type="button"
              className="mt-5 w-full px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition"
            >
              View Jobs
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900">
              Manage Employers
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Review employer accounts and companies.
            </p>

            <button
              type="button"
              className="mt-5 w-full px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition"
            >
              View Employers
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AdminDashboard;

