
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/axios";

const API_URL = VITE_API_URL ;

const JobSeekerProfile = () => {
  const [formData, setFormData] = useState({
    phone: "",
    location: "",
    bio: "",
    skills: "",
    education: "",
    experience: "",
  });

  const [resume, setResume] = useState(null);
  const [existingResume, setExistingResume] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =====================================================
  // FETCH PROFILE
  // =====================================================

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login first.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.get(
        `${API_URL}/job-seeker/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const profile = response.data.profile;

      if (profile) {
        setFormData({
          phone: profile.phone || "",
          location: profile.location || "",
          bio: profile.bio || "",
          skills: profile.skills || "",
          education: profile.education || "",
          experience: profile.experience || "",
        });

        // Existing resume
        if (profile.resume) {
          setExistingResume(profile.resume);
        }
      }
    } catch (error) {
      console.log("Profile Fetch Error:", error);

      setError(
        error.response?.data?.message ||
          "Profile load nahi ho saki."
      );
    } finally {
      setLoading(false);
    }
  };

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
  // RESUME CHANGE
  // =====================================================

  const handleResumeChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setResume(null);
      return;
    }

    // PDF check
    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      setResume(null);
      e.target.value = "";
      return;
    }

    // 5MB check
    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      setError("Resume size must not exceed 5MB.");
      setResume(null);
      e.target.value = "";
      return;
    }

    setError("");
    setResume(file);
  };

  // =====================================================
  // SAVE PROFILE
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
    setSuccess("");

    try {
      const data = new FormData();

      data.append("phone", formData.phone);
      data.append("location", formData.location);
      data.append("bio", formData.bio);
      data.append("skills", formData.skills);
      data.append("education", formData.education);
      data.append("experience", formData.experience);

      // Resume only if selected
      if (resume) {
        data.append("resume", resume);
      }

      const response = await api.post(
        `${API_URL}/job-seeker/profile`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      setSuccess(
        response.data.message ||
          "Profile saved successfully."
      );

      // Updated profile backend se mil jaye
      if (response.data.profile?.resume) {
        setExistingResume(response.data.profile.resume);
      }

      // Selected file clear
      setResume(null);

      // Input reset
      const fileInput = document.getElementById(
        "resume"
      );

      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      console.log("Profile Save Error:", error);

      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;

        const firstError =
          Object.values(errors)[0]?.[0];

        setError(
          firstError ||
            "Please check the form."
        );
      } else {
        setError(
          error.response?.data?.message ||
            "Profile save nahi ho saki."
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
        <div className="text-center">
          <p className="text-slate-600">
            Loading profile...
          </p>
        </div>
      </main>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <main className="min-h-screen bg-slate-100">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

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

            <Link
              to="/job-seeker-applications"
              className="text-sm font-medium text-slate-700 hover:text-blue-600"
            >
              Applications
            </Link>

          </div>
        </div>
      </nav>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <section className="max-w-3xl mx-auto px-4 md:px-8 py-8">

        {/* HEADER */}

        <div className="mb-8">

          <h1 className="text-3xl font-bold text-slate-900">
            My Profile
          </h1>

          <p className="mt-2 text-slate-600">
            Create and manage your professional profile.
          </p>

        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
            {error}
          </div>
        )}

        {/* SUCCESS */}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 text-sm">
            {success}
          </div>
        )}

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8"
        >

          {/* PHONE */}

          <div className="mb-5">

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Phone
            </label>

            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. 03001234567"
              className="w-full px-4 py-3 rounded-lg border border-slate-300 outline-none focus:border-blue-600"
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
              className="w-full px-4 py-3 rounded-lg border border-slate-300 outline-none focus:border-blue-600"
            />

          </div>

          {/* BIO */}

          <div className="mb-5">

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Bio
            </label>

            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="5"
              placeholder="Tell employers about yourself..."
              className="w-full px-4 py-3 rounded-lg border border-slate-300 outline-none focus:border-blue-600 resize-none"
            />

          </div>

          {/* SKILLS */}

          <div className="mb-5">

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Skills
            </label>

            <textarea
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              rows="4"
              placeholder="React, Laravel, PHP, MySQL..."
              className="w-full px-4 py-3 rounded-lg border border-slate-300 outline-none focus:border-blue-600 resize-none"
            />

          </div>

          {/* EDUCATION */}

          <div className="mb-5">

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Education
            </label>

            <textarea
              name="education"
              value={formData.education}
              onChange={handleChange}
              rows="4"
              placeholder="BS Computer Science..."
              className="w-full px-4 py-3 rounded-lg border border-slate-300 outline-none focus:border-blue-600 resize-none"
            />

          </div>

          {/* EXPERIENCE */}

          <div className="mb-5">

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Experience
            </label>

            <textarea
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              rows="5"
              placeholder="2 years experience as a frontend developer..."
              className="w-full px-4 py-3 rounded-lg border border-slate-300 outline-none focus:border-blue-600 resize-none"
            />

          </div>

          {/* =====================================================
              RESUME
          ===================================================== */}

          <div className="mb-8">

            <label
              htmlFor="resume"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Resume
            </label>

            <input
              id="resume"
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleResumeChange}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm bg-white"
            />

            <p className="mt-2 text-xs text-slate-500">
              Only PDF files are allowed. Maximum size: 5MB.
            </p>

            {/* New selected resume */}

            {resume && (
              <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">

                <p className="text-sm text-blue-700">
                  Selected:{" "}
                  <span className="font-semibold">
                    {resume.name}
                  </span>
                </p>

              </div>
            )}

            {/* Existing resume */}

            {!resume && existingResume && (
              <div className="mt-3 bg-slate-50 border border-slate-200 rounded-lg p-3">

                <p className="text-sm text-slate-600">
                  Resume already uploaded.
                </p>

              </div>
            )}

          </div>

          {/* BUTTON */}

          <button
            type="submit"
            disabled={saving}
            className="w-full px-5 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving
              ? "Saving..."
              : "Save Profile"}
          </button>

        </form>

      </section>

    </main>
  );
};

export default JobSeekerProfile;