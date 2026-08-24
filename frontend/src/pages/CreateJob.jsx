import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const CreateJob = () => {

  // Page change karne ke liye
  const navigate = useNavigate();

  // Form ka data
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    salary: "",
    location: "",
    status: "active",
  });

  // Loading state
  const [loading, setLoading] = useState(false);

  // Input change handle karne ke liye
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {

      // Token localStorage se le rahe hain
      const token = localStorage.getItem("token");

      // Backend ko job data send kar rahe hain
      // company_id yahan nahi bhejni
      // backend automatically company_id find karega
      const response = await axios.post(
        "http://localhost:8000/api/jobs",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      // Success message
      alert(response.data.message);

      // Job create hone ke baad employer jobs page
      navigate("/employer-jobs");

    } catch (error) {

      console.error("Create Job Error:", error);

      // Backend ka error message show karna
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Something went wrong while creating the job.");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100">

      {/* ================= NAVBAR ================= */}

      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">

          <Link
            to="/employer-dashboard"
            className="text-xl font-bold text-blue-600"
          >
            JobPortal
          </Link>

          <Link
            to="/employer-dashboard"
            className="text-sm font-medium text-slate-700 hover:text-blue-600"
          >
            Dashboard
          </Link>

        </div>
      </nav>

      {/* ================= FORM ================= */}

      <section className="max-w-4xl mx-auto px-4 md:px-8 py-10">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Create a Job
          </h1>

          <p className="mt-2 text-slate-600">
            Post a new job opportunity for job seekers.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-6"
        >

          {/* Job Title */}
          <div>

            <label
              htmlFor="title"
              className="block mb-2 text-sm font-medium text-slate-700"
            >
              Job Title
            </label>

            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Frontend Developer"
              required
              className="w-full px-4 py-3 rounded-lg border border-slate-300 outline-none focus:border-blue-600"
            />

          </div>

          {/* Description */}
          <div>

            <label
              htmlFor="description"
              className="block mb-2 text-sm font-medium text-slate-700"
            >
              Job Description
            </label>

            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the job responsibilities and requirements..."
              rows="6"
              required
              className="w-full px-4 py-3 rounded-lg border border-slate-300 outline-none focus:border-blue-600 resize-none"
            />

          </div>

          {/* Salary + Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Salary */}
            <div>

              <label
                htmlFor="salary"
                className="block mb-2 text-sm font-medium text-slate-700"
              >
                Salary
              </label>

              <input
                type="number"
                id="salary"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="e.g. 100000"
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-300 outline-none focus:border-blue-600"
              />

            </div>

            {/* Location */}
            <div>

              <label
                htmlFor="location"
                className="block mb-2 text-sm font-medium text-slate-700"
              >
                Location
              </label>

              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Lahore"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 outline-none focus:border-blue-600"
              />

            </div>

          </div>

          {/* Status */}
          <div>

            <label
              htmlFor="status"
              className="block mb-2 text-sm font-medium text-slate-700"
            >
              Job Status
            </label>

            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 outline-none focus:border-blue-600"
            >
              <option value="active">Active</option>
              <option value="closed">Closed</option>
            </select>

          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-2">

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Job"}
            </button>

            <Link
              to="/employer-dashboard"
              className="px-6 py-3 rounded-lg border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Link>

          </div>

        </form>

      </section>
    </main>
  );
};

export default CreateJob;