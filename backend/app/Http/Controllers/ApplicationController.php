<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\Company;
use App\Models\Job;
use Illuminate\Http\Request;

class ApplicationController extends Controller
{
    // =========================================================
    // JOB SEEKER → JOB PAR APPLY KARNA
    // =========================================================
    public function store(Request $request)
    {
        // Logged-in user nikal rahe hain
        $user = auth()->user();

        // Agar user login nahi hai
        if (! $user) {
            return response()->json([
                'message' => 'User not authenticated.',
            ], 401);
        }

        // Sirf job seeker apply kar sakta hai
        if ($user->role !== 'job_seeker') {
            return response()->json([
                'message' => 'Only job seekers can apply for jobs.',
            ], 403);
        }

        // Frontend se job_id lazmi hai
        $validated = $request->validate([
            'job_id' => 'required|exists:job_posts,id',
        ]);

        // Check karte hain ke user ne pehle se apply to nahi kiya
        $existingApplication = Application::where('user_id', $user->id)
            ->where('job_id', $validated['job_id'])
            ->first();

        // Duplicate application allow nahi hogi
        if ($existingApplication) {
            return response()->json([
                'message' => 'You have already applied for this job.',
            ], 409);
        }

        // Job find kar rahe hain
        $job = Job::find($validated['job_id']);

        // Safety check
        if (! $job) {
            return response()->json([
                'message' => 'Job not found.',
            ], 404);
        }

        // Sirf active jobs par apply ho sakta hai
        if ($job->status !== 'active') {
            return response()->json([
                'message' => 'You cannot apply for a job that is not active.',
            ], 400);
        }

        // New application create kar rahe hain
        $application = new Application;

        // Current logged-in job seeker ki ID
        $application->user_id = $user->id;

        // Jis job par apply kiya ja raha hai uski ID
        $application->job_id = $job->id;
$application->status = 'pending';
        // Application save
        $application->save();

        // Success response
        return response()->json([
            'message' => 'Application submitted successfully.',
            'application' => $application,
        ], 201);
    }


    // =========================================================
    // JOB SEEKER → APNI APPLICATIONS DEKHNA
    // =========================================================
    public function index()
    {
        // Logged-in user ki applications hi show hongi
        $applications = Application::with('job.company')
            ->where('user_id', auth()->id())
            ->latest()
            ->get();

        return response()->json($applications);
    }


    // =========================================================
    // EMPLOYER → APNI COMPANY KI APPLICATIONS DEKHNA
    // =========================================================
    public function companyApplications($companyId)
    {
        // Company find kar rahe hain
        $company = Company::find($companyId);

        // Company nahi mili
        if (! $company) {
            return response()->json([
                'message' => 'Company not found.',
            ], 404);
        }

        // Check kar rahe hain company isi employer ki hai
        if ($company->user_id !== auth()->id()) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        // Is company ki jobs par aane wali applications
       $applications = Application::with(['job', 'user'])
    ->whereHas('job', function ($query) use ($companyId) {
        $query->where('company_id', $companyId);
    })
    ->latest()
    ->get();

        return response()->json($applications);
    }


    // =========================================================
    // EMPLOYER → APPLICATION ACCEPT / REJECT KARNA
    // =========================================================
    public function updateStatus(Request $request, $applicationId)
    {
        // Sirf accepted ya rejected status allowed hai
        $validated = $request->validate([
            'status' => 'required|in:accepted,rejected',
        ]);

        // Application find kar rahe hain
        $application = Application::with('job.company')
            ->find($applicationId);

        // Application nahi mili
        if (! $application) {
            return response()->json([
                'message' => 'Application not found.',
            ], 404);
        }

        // Check karte hain job ki company isi employer ki hai
        if ($application->job->company->user_id !== auth()->id()) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        // Status update
        $application->status = $validated['status'];

        // Database mein save
        $application->save();

        return response()->json([
            'message' => 'Application status updated successfully.',
            'application' => $application,
        ]);
    }
}