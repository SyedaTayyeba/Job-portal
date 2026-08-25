<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\JobController;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\JobSeekerProfileController;
use App\Http\Controllers\AdminController;


// =====================================================
// PUBLIC ROUTES
// =====================================================

Route::post('/register', [AuthController::class, 'register']);

Route::post('/login', [AuthController::class, 'login']);


// =====================================================
// PUBLIC JOB ROUTES
// =====================================================

Route::get('/jobs', [JobController::class, 'index']);

Route::get('/jobs/{id}', [JobController::class, 'show']);


// =====================================================
// PUBLIC COMPANY ROUTES
// =====================================================

Route::get('/companies', [CompanyController::class, 'index']);

Route::get('/company/{id}', [CompanyController::class, 'show']);


// =====================================================
// AUTHENTICATED ROUTES
// =====================================================

Route::middleware('auth:sanctum')->group(function () {

    // =================================================
    // CURRENT USER
    // =================================================

    Route::get('/user', function (Request $request) {
        return response()->json(
            $request->user()
        );
    });


    // =================================================
    // LOGOUT
    // =================================================

    Route::post(
        '/logout',
        [AuthController::class, 'logout']
    );


    // =================================================
    // ADMIN
    // =================================================

    Route::get(
        '/admin/stats',
        [AdminController::class, 'stats']
    );

    Route::get(
        '/admin/users',
        [AdminController::class, 'users']
    );

    Route::get(
        '/admin/employers',
        [AdminController::class, 'employers']
    );

    Route::get(
        '/admin/companies',
        [AdminController::class, 'companies']
    );

    Route::get(
        '/admin/jobs',
        [AdminController::class, 'jobs']
    );

    Route::delete(
        '/admin/users/{id}',
        [AdminController::class, 'deleteUser']
    );

    Route::delete(
        '/admin/companies/{id}',
        [AdminController::class, 'destroyCompany']
    );

    Route::delete(
        '/admin/jobs/{id}',
        [AdminController::class, 'destroyJob']
    );


    // =================================================
    // COMPANY
    // =================================================

    Route::post(
        '/company',
        [CompanyController::class, 'store']
    );

    Route::put(
        '/companies/{id}',
        [CompanyController::class, 'update']
    );

    Route::delete(
        '/companies/{id}',
        [CompanyController::class, 'destroy']
    );


    // =================================================
    // JOBS
    // =================================================

    Route::post(
        '/jobs',
        [JobController::class, 'store']
    );

    Route::put(
        '/jobs/{id}',
        [JobController::class, 'update']
    );

    Route::delete(
        '/jobs/{id}',
        [JobController::class, 'destroy']
    );


    // =================================================
    // APPLICATIONS
    // =================================================

    Route::post(
        '/apply',
        [ApplicationController::class, 'store']
    );

    Route::get(
        '/applications',
        [ApplicationController::class, 'index']
    );

    Route::get(
        '/company/{companyId}/applications',
        [ApplicationController::class, 'companyApplications']
    );

    Route::put(
        '/applications/{applicationId}/status',
        [ApplicationController::class, 'updateStatus']
    );


    // =================================================
    // JOB SEEKER PROFILE
    // =================================================

    Route::get(
        '/job-seeker/profile',
        [JobSeekerProfileController::class, 'show']
    );

    Route::post(
        '/job-seeker/profile',
        [JobSeekerProfileController::class, 'store']
    );

    Route::delete(
        '/job-seeker/profile',
        [JobSeekerProfileController::class, 'destroy']
    );
});