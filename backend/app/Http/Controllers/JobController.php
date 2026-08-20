<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Job;
class JobController extends Controller
{
   public function store(Request $request)
   {
       $validated = $request->validate([
           'title' => 'required|string|max:255',
           'description' => 'required|string|max:1000',
           'salary' => 'nullable|numeric',
           'location' => 'required|string|max:255',
           'status' => 'required|in:active,closed',
       ]);

       $job = auth()->user()->company->jobs()->create($validated);

       return response()->json([
           'message' => 'Job created successfully',
           'job' => $job,
       ], 201);
   }
   public function index()
   {
       $jobs = Job::with('company')->get(); //eager load the company relationship to avoid N+1 problem
       return response()->json($jobs);
   }
   // for showing a single job post
   public function show($id)
   {
       $job = Job::with('company')->findOrFail($id);
       return response()->json($job);
   }
   //
   public function update(Request $request, $id)
   {
       $job = Job::findOrFail($id);

       // Check if the authenticated user is the owner of the job post
       if ($job->company_id !== auth()->user()->company->id) {
           return response()->json(['message' => 'Unauthorized'], 403);
       }

       $validated = $request->validate([
           'title' => 'sometimes|required|string|max:255',
           'description' => 'sometimes|required|string|max:1000',
           'salary' => 'sometimes|nullable|numeric',
           'location' => 'sometimes|required|string|max:255',
           'status' => 'sometimes|required|in:active,closed',
       ]);

       $job->update($validated);

       return response()->json([
           'message' => 'Job updated successfully',
           'job' => $job,
       ]);
   }
   public function destroy($id)
   {
       $job = Job::findOrFail($id);

       // Check if the authenticated user is the owner of the job post
       if ($job->company_id !== auth()->user()->company->id) {
           return response()->json(['message' => 'Unauthorized'], 403);
       }

       $job->delete();

       return response()->json(['message' => 'Job deleted successfully']);
   }
}
