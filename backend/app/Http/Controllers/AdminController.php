<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Job;
use App\Models\Company;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    // =====================================================
    // ADMIN CHECK
    // =====================================================

    private function checkAdmin(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'User not authenticated.',
            ], 401);
        }

        if ($user->role !== 'admin') {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        return null;
    }


    // =====================================================
    // ADMIN DASHBOARD STATS
    // =====================================================

    public function stats(Request $request)
    {
        if ($error = $this->checkAdmin($request)) {
            return $error;
        }

        return response()->json([
            'total_users' => User::count(),

            'job_seekers' => User::where(
                'role',
                'job_seeker'
            )->count(),

            'employers' => User::where(
                'role',
                'employer'
            )->count(),

            'jobs' => Job::count(),
        ]);
    }


    // =====================================================
    // GET ALL USERS
    // =====================================================

    public function users(Request $request)
    {
        if ($error = $this->checkAdmin($request)) {
            return $error;
        }

        $users = User::latest()->get();

        return response()->json([
            'users' => $users,
        ]);
    }


    // =====================================================
    // GET ALL EMPLOYERS
    // =====================================================

    public function employers(Request $request)
    {
        if ($error = $this->checkAdmin($request)) {
            return $error;
        }

        $employers = User::where(
            'role',
            'employer'
        )
        ->latest()
        ->get();

        return response()->json([
            'employers' => $employers,
        ]);
    }


    // =====================================================
    // GET ALL JOBS
    // =====================================================

    public function jobs(Request $request)
    {
        if ($error = $this->checkAdmin($request)) {
            return $error;
        }

        $jobs = Job::with([
            'company.user'
        ])
        ->latest()
        ->get();

        return response()->json([
            'jobs' => $jobs,
        ]);
    }


    // =====================================================
    // GET ALL COMPANIES
    // =====================================================

    public function companies(Request $request)
    {
        if ($error = $this->checkAdmin($request)) {
            return $error;
        }

        $companies = Company::with('user')
            ->latest()
            ->get();

        return response()->json([
            'companies' => $companies,
        ]);
    }


    // =====================================================
    // DELETE USER
    // =====================================================

    public function deleteUser(Request $request, $id)
    {
        if ($error = $this->checkAdmin($request)) {
            return $error;
        }

        $admin = $request->user();

        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'message' => 'User not found.',
            ], 404);
        }

        // Admin khud ko delete nahi kar sakta
        if ($user->id === $admin->id) {
            return response()->json([
                'message' => 'You cannot delete your own admin account.',
            ], 400);
        }

        // User ke Sanctum tokens delete
        $user->tokens()->delete();

        // User delete
        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully.',
        ]);
    }


    // =====================================================
    // DELETE COMPANY
    // =====================================================

    public function destroyCompany(Request $request, $id)
    {
        if ($error = $this->checkAdmin($request)) {
            return $error;
        }

        $company = Company::find($id);

        if (!$company) {
            return response()->json([
                'message' => 'Company not found.',
            ], 404);
        }

        $company->delete();

        return response()->json([
            'message' => 'Company deleted successfully.',
        ]);
    }


    // =====================================================
    // DELETE JOB
    // =====================================================

    public function destroyJob(Request $request, $id)
    {
        if ($error = $this->checkAdmin($request)) {
            return $error;
        }

        $job = Job::find($id);

        if (!$job) {
            return response()->json([
                'message' => 'Job not found.',
            ], 404);
        }

        $job->delete();

        return response()->json([
            'message' => 'Job deleted successfully.',
        ]);
    }
}