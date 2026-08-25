<?php

namespace App\Http\Controllers;

use App\Models\JobSeekerProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class JobSeekerProfileController extends Controller
{
    // =====================================================
    // GET MY PROFILE
    // =====================================================

    public function show()
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json([
                'message' => 'User not authenticated.'
            ], 401);
        }

        if ($user->role !== 'job_seeker') {
            return response()->json([
                'message' => 'Only job seekers can access this profile.'
            ], 403);
        }

        $profile = JobSeekerProfile::where(
            'user_id',
            $user->id
        )->first();

        if ($profile) {
            $profile->resume_url = $profile->resume
                ? asset('storage/' . $profile->resume)
                : null;
        }

        return response()->json([
            'profile' => $profile
        ]);
    }


    // =====================================================
    // CREATE / UPDATE PROFILE
    // =====================================================

    public function store(Request $request)
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json([
                'message' => 'User not authenticated.'
            ], 401);
        }

        if ($user->role !== 'job_seeker') {
            return response()->json([
                'message' => 'Only job seekers can create a profile.'
            ], 403);
        }

        $validated = $request->validate([
            'phone' => 'nullable|string|max:30',
            'location' => 'nullable|string|max:255',
            'bio' => 'nullable|string|max:2000',
            'skills' => 'nullable|string|max:2000',
            'education' => 'nullable|string|max:2000',
            'experience' => 'nullable|string|max:3000',

            // Resume
            'resume' => 'nullable|file|mimes:pdf|max:5120',
        ]);

        $profile = JobSeekerProfile::where(
            'user_id',
            $user->id
        )->first();

        // Agar profile pehle se nahi hai
        if (!$profile) {
            $profile = new JobSeekerProfile();
            $profile->user_id = $user->id;
        }

        // Normal fields
        $profile->phone = $validated['phone'] ?? null;
        $profile->location = $validated['location'] ?? null;
        $profile->bio = $validated['bio'] ?? null;
        $profile->skills = $validated['skills'] ?? null;
        $profile->education = $validated['education'] ?? null;
        $profile->experience = $validated['experience'] ?? null;


        // =================================================
        // RESUME UPLOAD
        // =================================================

        if ($request->hasFile('resume')) {

            // Purana resume delete karo
            if ($profile->resume) {
                Storage::disk('public')->delete(
                    $profile->resume
                );
            }

            // New resume save
            $resumePath = $request
                ->file('resume')
                ->store('resumes', 'public');

            $profile->resume = $resumePath;
        }


        // Save profile
        $profile->save();


        // Resume URL
        $profile->resume_url = $profile->resume
            ? asset('storage/' . $profile->resume)
            : null;


        return response()->json([
            'message' => 'Profile saved successfully.',
            'profile' => $profile
        ]);
    }


    // =====================================================
    // DELETE PROFILE
    // =====================================================

    public function destroy()
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json([
                'message' => 'User not authenticated.'
            ], 401);
        }

        if ($user->role !== 'job_seeker') {
            return response()->json([
                'message' => 'Only job seekers can delete their profile.'
            ], 403);
        }

        $profile = JobSeekerProfile::where(
            'user_id',
            $user->id
        )->first();

        if (!$profile) {
            return response()->json([
                'message' => 'Profile not found.'
            ], 404);
        }

        // Resume delete
        if ($profile->resume) {
            Storage::disk('public')->delete(
                $profile->resume
            );
        }

        // Profile delete
        $profile->delete();

        return response()->json([
            'message' => 'Profile deleted successfully.'
        ]);
    }
}