<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\Company;
use App\Models\Job;
use Illuminate\Http\Request;

class ApplicationController extends Controller
{
    public function store(Request $request)
    {
        $user = auth()->user();

        if (! $user) {
            return response()->json([
                'message' => 'User not authenticated.',
            ], 401);
        }

        if ($user->role !== 'employer') {
            return response()->json([
                'message' => 'Only employers can create jobs.',
            ], 403);
        }
        // Get the currently authenticated user
        $user = auth()->user();

        // Check if the user is authenticated
        if (! $user) {
            return response()->json([
                'message' => 'User not authenticated.',
            ], 401);
        }

        // Only job seekers are allowed to apply for jobs
        if ($user->role !== 'job_seeker') {
            return response()->json([
                'message' => 'Only job seekers can apply for jobs.',
            ], 403);
        }

        // Validate the job ID and make sure the job exists
        $request->validate([
            'job_id' => 'required|exists:job_posts,id',
        ]);

        // Check if this user has already applied for this job
        $existingApplication = Application::where('user_id', auth()->id())
            ->where('job_id', $request->job_id)
            ->first();

        // Prevent duplicate applications
        if ($existingApplication) {
            return response()->json([
                'message' => 'You have already applied for this job.',
            ], 409);
        }

        // Find the selected job
        $job = Job::find($request->job_id);

        // Check if the job exists
        if (! $job) {
            return response()->json([
                'message' => 'Job not found.',
            ], 404);
        }

        // Only allow applications for active jobs
        if ($job->status !== 'active') {
            return response()->json([
                'message' => 'You cannot apply for a job that is not active.',
            ], 400);
        }

        // Create a new application
        $application = new Application;

        // Store the ID of the logged-in user
        $application->user_id = auth()->id();

        // Store the ID of the job being applied for
        $application->job_id = $request->job_id;

        // Save the application in the database
        $application->save();

        // Return a successful response
        return response()->json([
            'message' => 'Application submitted successfully.',
        ], 201);
    }

    // user can see the submitted applications
    public function index()
    {
        $applications = Application::with('job')->where('user_id', auth()->id())->get();

        return response()->json($applications);
    }

    // company can see the applications submitted for their jobs
    public function companyApplications($companyId)
    {
        $company = Company::find($companyId);

        if (! $company) {
            return response()->json([
                'message' => 'Company not found',
            ], 404);
        }

        if ($company->user_id !== auth()->id()) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $applications = Application::with('job')
            ->whereHas('job', function ($query) use ($companyId) {
                $query->where('company_id', $companyId);
            })
            ->get();

        return response()->json($applications);
    }

    public function updateStatus(Request $request, $applicationId)
    {
        $request->validate([
            'status' => 'required|in:accepted,rejected',
        ]);

        $application = Application::find($applicationId);

        if (! $application) {
            return response()->json(['message' => 'Application not found.'], 404);
        }

        // Check if the authenticated user is the owner of the company that posted the job
        if ($application->job->company->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $application->status = $request->status;
        $application->save();

        return response()->json(['message' => 'Application status updated successfully.']);
    }
}
