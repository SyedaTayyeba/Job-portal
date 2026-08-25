import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import JobSeekerDashboard from "./pages/JobSeekerDashboard";
import EmployerDashboard from "./pages/EmployerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import CreateJob from "./pages/CreateJob";
import MyApplications from "./pages/MyApplications";
import EmployerApplications from "./pages/EmployerApplications";
import EmployerJobs from "./pages/EmployerJobs";
import EditJob from "./pages/EditJob";
import CompanyProfile from "./pages/CompanyProfile";
import JobSeekerApplications from "./pages/JobSeekerApplications";
import JobSeekerProfile from "./pages/JobSeekerProfile";
import AdminUsers from "./pages/AdminUsers";
import AdminJobs from "./pages/AdminJobs";
import AdminEmployers from "./pages/AdminEmployers";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/job-seeker-dashboard"
          element={
            <ProtectedRoute allowedRole="job_seeker">
              <JobSeekerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employer-dashboard"
          element={
            <ProtectedRoute allowedRole="employer">
              <EmployerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/jobs" element={<Jobs />} />

        {/* :id dynamic hai.
    Matlab /jobs/1, /jobs/2, /jobs/3 sab isi page par jayenge. */}
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/create-job" element={<CreateJob />} />
        <Route path="/my-applications" element={<MyApplications />} />
        <Route
          path="/employer-applications"
          element={<EmployerApplications />}
        />
        <Route path="/employer-jobs" element={<EmployerJobs />} />
        <Route path="/edit-job/:id" element={<EditJob />} />
        <Route path="/company-profile" element={<CompanyProfile />} />
        <Route
          path="/job-seeker-applications"
          element={<JobSeekerApplications />}
        />
        <Route path="/job-seeker-profile" element={<JobSeekerProfile />} />
        <Route
  path="/admin-users"
  element={
    <ProtectedRoute allowedRole="admin">
      <AdminUsers />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin-jobs"
  element={
    <ProtectedRoute allowedRole="admin">
      <AdminJobs />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin-employers"
  element={
    <ProtectedRoute allowedRole="admin">
      <AdminEmployers />
    </ProtectedRoute>
  }
/>
<Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
