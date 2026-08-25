import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EditJob = () => {
  // URL se job ID milegi
  // Example: /edit-job/5 → id = 5
  const { id } = useParams();

  const navigate = useNavigate();

  // Form data
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    salary: "",
    location: "",
    status: "active",
  });

  // Page loading
  const [loading, setLoading] = useState(true);

  // Button loading
  const [saving, setSaving] = useState(false);

  // Error message
  const [error, setError] = useState("");

  // ==========================================
  // EXISTING JOB BACKEND SE GET KARNA
  // ==========================================

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/jobs/${id}`
        );

        const job = response.data;

        // Existing job ki values form mein set
        setFormData({
          title: job.title || "",
          description: job.description || "",
          salary: job.salary || "",
          location: job.location || "",
          status: job.status || "active",
        });

      } catch (error) {
        console.log("Fetch Job Error:", error);

        setError(
          error.response?.data?.message ||
            "Job load nahi ho saki."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  // ==========================================
  // INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // ==========================================
  // UPDATE JOB
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login first.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      // Backend ka PUT route
      await axios.put(
        `http://localhost:8000/api/jobs/${id}`,
        {
          title: formData.title,
          description: formData.description,
          salary: formData.salary,
          location: formData.location,
          status: formData.status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      // Update successful
      alert("Job successfully updated.");

      // Jobs management page par wapas
      navigate("/employer-jobs");

    } catch (error) {
      console.log("Update Job Error:", error);

      // Laravel validation errors
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;

        const firstError =
          Object.values(errors)[0]?.[0];

        setError(firstError || "Please check the form.");
      } else {
        setError(
          error.response?.data?.message ||
            "Job update nahi ho saki."
        );
      }

    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-slate-600">
          Loading job...
        </p>
      </main>
    );
  }

  // ==========================================
  // PAGE
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
              to="/employer-jobs"
              className="text-sm font-medium text-slate-700 hover:text-blue-600"
            >
              My Jobs
            </Link>

          </div>
        </div>
      </nav>

      {/* ================= FORM ================= */}

      <section className="max-w-3xl mx-auto px-4 md:px-8 py-8">

        <div className="mb-8">

          <h1 className="text-3xl font-bold text-slate-900">
            Edit Job
          </h1>

          <p className="mt-2 text-slate-600">
            Update the details of your job posting.
          </p>

        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8"
        >

          {/* TITLE */}

          <div className="mb-5">

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Job Title
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g. Frontend Developer"
              className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-slate-900 outline-none focus:border-blue-600"
            />

          </div>

          {/* DESCRIPTION */}

          <div className="mb-5">

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="6"
              placeholder="Describe the job..."
              className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-slate-900 outline-none focus:border-blue-600 resize-none"
            />

          </div>

          {/* SALARY */}

          <div className="mb-5">

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Salary
            </label>

            <input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              required
              min="0"
              placeholder="e.g. 100000"
              className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-slate-900 outline-none focus:border-blue-600"
            />

          </div>

          {/* LOCATION */}

          <div className="mb-5">

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Location
            </label>

            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Lahore, Pakistan"
              className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-slate-900 outline-none focus:border-blue-600"
            />

          </div>

          {/* STATUS */}

          <div className="mb-8">

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-slate-900 bg-white outline-none focus:border-blue-600"
            >
              <option value="active">
                Active
              </option>

              <option value="closed">
                Closed
              </option>
            </select>

          </div>

          {/* BUTTONS */}

          <div className="flex flex-col sm:flex-row gap-3">

            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-5 py-3 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Updating..." : "Update Job"}
            </button>

            <Link
              to="/employer-jobs"
              className="flex-1 px-5 py-3 rounded-lg border border-slate-300 text-slate-700 text-sm font-semibold text-center hover:bg-slate-50"
            >
              Cancel
            </Link>

          </div>

        </form>

      </section>
    </main>
  );
};

export default EditJob;
