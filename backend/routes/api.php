<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\JobController;
use App\Http\Controllers\ApplicationController;


// =====================================================
// PUBLIC ROUTES
// In routes ko login ke baghair access kiya ja sakta hai
// =====================================================

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


// =====================================================
// PUBLIC JOB ROUTES
// Job seeker ya koi bhi visitor jobs dekh sakta hai
// =====================================================

// Sab jobs dekhna
Route::get('/jobs', [JobController::class, 'index']);

// Ek single job ki details dekhna
Route::get('/jobs/{id}', [JobController::class, 'show']);


// =====================================================
// PUBLIC COMPANY ROUTES
// Companies ki information dekhna
// =====================================================

Route::get('/companies', [CompanyController::class, 'index']);
Route::get('/company/{id}', [CompanyController::class, 'show']);


// =====================================================
// AUTHENTICATED ROUTES
// In routes ke liye login + Sanctum token zaroori hai
// =====================================================

Route::middleware('auth:sanctum')->group(function () {

    // =================================================
    // USER
    // Currently logged-in user ki information
    // =================================================

    Route::get('/user', function (Request $request) {
        return $request->user();
    });


    // =================================================
    // AUTH
    // Logout
    // =================================================

    Route::post('/logout', [AuthController::class, 'logout']);


    // =================================================
    // COMPANY
    // Employer company create/update/delete kar sakta hai
    // =================================================

    Route::post('/company', [CompanyController::class, 'store']);

    Route::put('/companies/{id}', [CompanyController::class, 'update']);

    Route::delete('/companies/{id}', [CompanyController::class, 'destroy']);


    // =================================================
    // JOBS
    // Employer job create/update/delete kar sakta hai
    // =================================================

    // New job create karna
    Route::post('/jobs', [JobController::class, 'store']);

    // Job update karna
    Route::put('/jobs/{id}', [JobController::class, 'update']);

    // Job delete karna
    Route::delete('/jobs/{id}', [JobController::class, 'destroy']);


    // =================================================
    // APPLICATIONS
    // Job seeker apply karega
    // Employer applications dekh sakta hai
    // =================================================

    Route::post('/apply', [ApplicationController::class, 'store']);

    Route::get('/applications', [ApplicationController::class, 'index']);

    Route::get(
        '/company/{companyId}/applications',
        [ApplicationController::class, 'companyApplications']
    );

    Route::put(
        '/applications/{applicationId}/status',
        [ApplicationController::class, 'updateStatus']
    );
});