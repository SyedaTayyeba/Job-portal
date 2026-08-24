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
import ManageJobs from "./pages/ManageJobs";

function App() {
  return (
    <BrowserRouter>
      <Routes>
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
        <Route path="/employer-jobs" element={<ManageJobs />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
