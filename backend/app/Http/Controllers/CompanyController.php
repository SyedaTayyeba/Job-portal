<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Company
class CompanyController extends Controller
{
   public function store(Request $request)
{
    // Get the currently authenticated user
    $user = auth()->user();

    // Check if the user is authenticated
    if (!$user) {
        return response()->json([
            'message' => 'User not authenticated.',
        ], 401);
    }

    // Only employers can create a company
    if ($user->role !== 'employer') {
        return response()->json([
            'message' => 'Only employers can create a company.',
        ], 403);
    }

    // Check if the employer already has a company
    if ($user->company) {
        return response()->json([
            'message' => 'You already have a company.',
        ], 409);
    }

    // Validate company data
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'description' => 'nullable|string|max:1000',
        'location' => 'required|string|max:255',
        'website' => 'nullable|url|max:255',
    ]);

    // Create company through the relationship
    $company = $user->company()->create($validated);

    return response()->json([
        'message' => 'Company created successfully',
        'company' => $company,
    ], 201);
}
public function show($id)
{
    $company = Company::findOrFail($id);

    return response()->json($company);
}

public function index(){
$companies = Company::all();
    return response()->json($companies);

}
public function update(Request $request, $id)
{
    // Get the currently authenticated user
    $user = auth()->user();

    // Check if the user is authenticated
    if (!$user) {
        return response()->json([
            'message' => 'User not authenticated.',
        ], 401);
    }

    // Only employers can update a company
    if ($user->role !== 'employer') {
        return response()->json([
            'message' => 'Only employers can update a company.',
        ], 403);
    }

    // Find the company
    $company = Company::findOrFail($id);

    // Check if the company belongs to the logged-in employer
    if ($company->user_id !== $user->id) {
        return response()->json([
            'message' => 'You are not authorized to update this company.',
        ], 403);
    }

    // Validate company data
    $validated = $request->validate([
        'name' => 'sometimes|required|string|max:255',
        'description' => 'nullable|string|max:1000',
        'location' => 'sometimes|required|string|max:255',
        'website' => 'nullable|url|max:255',
    ]);

    // Update the company
    $company->update($validated);

    return response()->json([
        'message' => 'Company updated successfully',
        'company' => $company,
    ]);
}
public function destroy($id)
{
    // Get the currently authenticated user
    $user = auth()->user();

    // Check if the user is authenticated
    if (!$user) {
        return response()->json([
            'message' => 'User not authenticated.',
        ], 401);
    }

    // Only employers can delete a company
    if ($user->role !== 'employer') {
        return response()->json([
            'message' => 'Only employers can delete a company.',
        ], 403);
    }

    // Find the company
    $company = Company::findOrFail($id);

    // Check if the company belongs to the logged-in employer
    if ($company->user_id !== $user->id) {
        return response()->json([
            'message' => 'You are not authorized to delete this company.',
        ], 403);
    }

    // Delete the company
    $company->delete();

    return response()->json([
        'message' => 'Company deleted successfully',
    ]);
}
}