import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/axios";

const CreateJob = () => {
  const navigate = useNavigate();

  // Form ki sari values yahan store hongi
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    salary: "",
    location: "",
    status: "active",
  });

  // Button click ke waqt loading show karne ke liye
  const [loading, setLoading] = useState(false);

  // Input change hone par state update hogi
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Form submit hone par ye function chalega
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      // Login ke waqt jo token save kiya tha wo yahan se milega
      const token = localStorage.getItem("token");

      // Backend ko job create karne ki request
      //
      // company_id hum frontend form se nahi le rahe.
      // Backend logged-in employer ki company verify karega.
      const response = await api.post(
        "/jobs",
        {
          title: formData.title,
          description: formData.description,
          salary: formData.salary,
          location: formData.location,
          status: formData.status,

          // IMPORTANT:
          // Tumhare current JobController mein company_id required hai.
          // Isliye temporarily yahan company ID deni hogi.
          //
          // Agar employer ki company ID 1 hai to 1.
          // Baad mein isko automatically logged-in employer ki company se
          // backend mein set kar denge.
          // company_id: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      alert(response.data.message);

      // Job create hone ke baad employer dashboard par wapas
      navigate("/employer-dashboard");
    } catch (error) {
      console.error("Create Job Error:", error);

      // Backend ka actual error user ko show karna
      if (error.response) {
        console.log("Backend Response:", error.response.data);

        alert(
          error.response.data.message ||
            "Job create nahi ho saki."
        );
      } else {
        alert("Server se connection nahi ho raha.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100">

      {/* ================= NAVBAR ================= */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">

          <h1 className="text-xl font-bold text-blue-600">
            JobPortal
          </h1>

          <button
            type="button"
            onClick={() => navigate("/employer-dashboard")}
            className="text-sm font-medium text-slate-700 hover:text-blue-600"
          >
            Dashboard
          </button>

        </div>
      </nav>

      {/* ================= FORM ================= */}
      <section className="max-w-4xl mx-auto px-4 md:px-8 py-8">

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">
            Create New Job
          </h2>

          <p className="mt-2 text-slate-600">
            Apni company ke liye new job post create karein.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5"
        >

          {/* Job Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Job Title
            </label>

            <input
              type="text"
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
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Job Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Job ki details yahan likhein..."
              rows="6"
              required
              className="w-full px-4 py-3 rounded-lg border border-slate-300 outline-none focus:border-blue-600 resize-none"
            />
          </div>

          {/* Salary */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Salary
            </label>

            <input
              type="number"
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
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Location
            </label>

            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Lahore"
              required
              className="w-full px-4 py-3 rounded-lg border border-slate-300 outline-none focus:border-blue-600"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Status
            </label>

            <select
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
          <div className="flex gap-3 pt-3">

            <button
              type="button"
              onClick={() => navigate("/employer-dashboard")}
              className="px-5 py-3 rounded-lg border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-3 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Job"}
            </button>

          </div>

        </form>
      </section>
    </main>
  );
};

export default CreateJob;