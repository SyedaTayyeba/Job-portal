<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Job;
use Illuminate\Http\Request;

class JobController extends Controller
{
    public function store(Request $request)
    {
        // Get the currently authenticated user
        $user = auth()->user();

        // Check if the user is authenticated
        if (! $user) {
            return response()->json([
                'message' => 'User not authenticated.',
            ], 401);
        }

        // Only employers can create jobs
        if ($user->role !== 'employer') {
            return response()->json([
                'message' => 'Only employers can create jobs.',
            ], 403);
        }

        // Validate the job data
        $request->validate([
            'company_id' => 'required|exists:companies,id',
            'title' => 'required|string',
            'description' => 'required|string',
            'salary' => 'required|numeric',
            'location' => 'required|string',
            'status' => 'required|in:active,closed',
        ]);

        // Find the company selected by the employer
        $company = Company::find($request->company_id);

        // Check if the company belongs to the logged-in employer
        if ($company->user_id !== auth()->id()) {
            return response()->json([
                'message' => 'You are not eligible to create a job for this company.',
            ], 403);
        }

        // Create the job
        $job = new Job;

        $job->company_id = $request->company_id;
        $job->title = $request->title;
        $job->description = $request->description;
        $job->salary = $request->salary;
        $job->location = $request->location;
        $job->status = $request->status;

        // Save the job
        $job->save();

        // Return successful response
        return response()->json([
            'message' => 'Job created successfully.',
            'job' => $job,
        ], 201);
    }

    public function index()
    {
        $jobs = Job::with('company')->get(); // eager load the company relationship to avoid N+1 problem

        return response()->json($jobs);
    }

    // for showing a single job post
    public function show($id)
    {
        $job = Job::with('company')->findOrFail($id);

        return response()->json($job);
    }

    //
    public function update(Request $request)
    {
        // Get the currently authenticated user
        $user = auth()->user();

        // Check if the user is authenticated
        if (! $user) {
            return response()->json([
                'message' => 'User not authenticated.',
            ], 401);
        }

        // Only employers can update jobs
        if ($user->role !== 'employer') {
            return response()->json([
                'message' => 'Only employers can update jobs.',
            ], 403);
        }

        // Get the job ID from the route
        $id = $request->route('id');

        // Find the job
        $job = Job::find($id);

        // Check if the job exists
        if (! $job) {
            return response()->json([
                'message' => 'Job not found.',
            ], 404);
        }

        // Find the company that owns this job
        $company = Company::find($job->company_id);

        // Check if the company exists
        if (! $company) {
            return response()->json([
                'message' => 'Company not found.',
            ], 404);
        }

        // Check if the authenticated employer owns the company
        if ($company->user_id !== $user->id) {
            return response()->json([
                'message' => 'You are not authorized to update this job.',
            ], 403);
        }

        // Validate the updated job data
        $validated = $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
            'salary' => 'required|numeric',
            'location' => 'required|string',
            'status' => 'required|in:active,closed',
        ]);

        // Update the job
        $job->title = $validated['title'];
        $job->description = $validated['description'];
        $job->salary = $validated['salary'];
        $job->location = $validated['location'];
        $job->status = $validated['status'];

        // Save the changes
        $job->save();

        // Return successful response
        return response()->json([
            'message' => 'Job updated successfully.',
            'job' => $job,
        ]);
    }

   public function destroy(Request $request)
{
    // 1. Current logged-in user
    $user = auth()->user();

    // 2. User authenticated hai?
    if (!$user) {
        return response()->json([
            'message' => 'User not authenticated.'
        ], 401);
    }

    // 3. Sirf employer job delete kar sakta hai
    if ($user->role !== 'employer') {
        return response()->json([
            'message' => 'Only employers can delete jobs.'
        ], 403);
    }

    // 4. URL se job ID lena
    $id = $request->route('id');

    // 5. Job find karna
    $job = Job::find($id);

    // 6. Job exist nahi karti
    if (!$job) {
        return response()->json([
            'message' => 'Job not found.'
        ], 404);
    }

    // 7. Job ki company find karna
    $company = Company::find($job->company_id);

    // 8. Company exist nahi karti
    if (!$company) {
        return response()->json([
            'message' => 'Company not found.'
        ], 404);
    }

    // 9. Check: kya ye company current employer ki hai?
    if ($company->user_id !== $user->id) {
        return response()->json([
            'message' => 'You are not authorized to delete this job.'
        ], 403);
    }

    // 10. Sab checks pass → job delete
    $job->delete();

    // 11. Success response
    return response()->json([
        'message' => 'Job deleted successfully.'
    ]);
}
}
