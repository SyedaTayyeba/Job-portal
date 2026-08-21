<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\JobController;
use App\Http\Controllers\ApplicationController;


// Public routes

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


// Public Job routes

Route::get('/jobs', [JobController::class, 'index']);
Route::get('/jobs/{id}', [JobController::class, 'show']);


// Public Company routes

Route::get('/companies', [CompanyController::class, 'index']);
Route::get('/company/{id}', [CompanyController::class, 'show']);


// Authenticated routes

Route::middleware('auth:sanctum')->group(function () {

    // User
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);


    // Company
    Route::post('/company', [CompanyController::class, 'store']);
    Route::put('/companies/{id}', [CompanyController::class, 'update']);
    Route::delete('/companies/{id}', [CompanyController::class, 'destroy']);


    // Jobs
    Route::post('/job', [JobController::class, 'store']);
    Route::put('/jobs/{id}', [JobController::class, 'update']);
    Route::delete('/jobs/{id}', [JobController::class, 'destroy']);


    // Applications
    Route::post('/apply', [ApplicationController::class, 'store']);
    Route::get('/applications', [ApplicationController::class, 'index']);

    Route::get('/company/{companyId}/applications', 
        [ApplicationController::class, 'companyApplications']
    );

    Route::put('/applications/{applicationId}/status', 
        [ApplicationController::class, 'updateStatus']
    );
});