import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const CompanyProfile = () => {
  const navigate = useNavigate();

  const [company, setCompany] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    website: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // COMPANY LOAD
  // =====================================================

  useEffect(() => {
    const fetchCompany = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login first.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:8000/api/companies"
        );

        const companies = response.data;

        const user = JSON.parse(
          localStorage.getItem("user")
        );

        const myCompany = companies.find(
          (item) => item.user_id === user?.id
        );

        if (myCompany) {
          setCompany(myCompany);

          setFormData({
            name: myCompany.name || "",
            description: myCompany.description || "",
            location: myCompany.location || "",
            website: myCompany.website || "",
          });
        }
      } catch (error) {
        console.log("Company Error:", error);

        setError(
          error.response?.data?.message ||
            "Company profile load nahi ho saka."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, []);

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // =====================================================
  // CREATE / UPDATE COMPANY
  // =====================================================

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
      let response;

      if (company) {
        // UPDATE
        response = await axios.put(
          `http://localhost:8000/api/companies/${company.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );
      } else {
        // CREATE
        response = await axios.post(
          "http://localhost:8000/api/company",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );
      }

      setCompany(response.data.company);

      alert(
        company
          ? "Company profile updated successfully."
          : "Company profile created successfully."
      );

      navigate("/employer-dashboard");

    } catch (error) {
      console.log("Company Save Error:", error);

      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;

        const firstError =
          Object.values(errors)[0]?.[0];

        setError(
          firstError ||
            "Please check the company information."
        );
      } else {
        setError(
          error.response?.data?.message ||
            "Company profile save nahi ho saka."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-slate-600">
          Loading company profile...
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

      {/* FORM */}

      <section className="max-w-3xl mx-auto px-4 md:px-8 py-8">

        <div className="mb-8">

          <h1 className="text-3xl font-bold text-slate-900">
            Company Profile
          </h1>

          <p className="mt-2 text-slate-600">
            Add your company information before posting jobs.
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

          {/* COMPANY NAME */}

          <div className="mb-5">

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Company Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g. ABC Software House"
              className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-slate-900 outline-none focus:border-blue-600"
            />

          </div>

          {/* DESCRIPTION */}

          <div className="mb-5">

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Company Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              placeholder="Tell candidates about your company..."
              className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-slate-900 outline-none focus:border-blue-600 resize-none"
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
              required
              placeholder="e.g. Lahore, Pakistan"
              className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-slate-900 outline-none focus:border-blue-600"
            />

          </div>

          {/* WEBSITE */}

          <div className="mb-8">

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Website
            </label>

            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://example.com"
              className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-slate-900 outline-none focus:border-blue-600"
            />

          </div>

          {/* BUTTONS */}

          <div className="flex flex-col sm:flex-row gap-3">

            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-5 py-3 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving
                ? "Saving..."
                : company
                ? "Update Company"
                : "Create Company"}
            </button>

            <Link
              to="/employer-dashboard"
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

export default CompanyProfile;