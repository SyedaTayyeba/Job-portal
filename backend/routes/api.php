<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/company', [CompanyController::class, 'store'])->middleware('auth:sanctum');
//jobs related routes
Route::post('/job', [JobController::class, 'store'])->middleware('auth:sanctum');
Route::get('/jobs', [JobController::class, 'index']);
Route::get('/jobs/{id}', [JobController::class, 'show']);
Route::put('/jobs/{id}', [JobController::class, 'update'])->middleware('auth:sanctum');
Route::delete('/jobs/{id}', [JobController::class, 'destroy'])->middleware('auth:sanctum');
//applicaton
Route::post('/apply', [ApplicationController::class, 'store'])->middleware('auth:sanctum');
Route::get('/applications', [ApplicationController::class, 'index'])->middleware('auth:sanctum');
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/company/{companyId}/applications', [ApplicationController::class, 'companyApplications']);
    Route::put('/applications/{applicationId}/status', [ApplicationController::class, 'updateStatus']);
});