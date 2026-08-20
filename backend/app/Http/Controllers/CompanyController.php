<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CompanyController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'location' => 'required|string|max:255',
            'website' => 'nullable|url|max:255',
        ]);

        $company = auth()->user()->company()->create($validated);

        return response()->json([
            'message' => 'Company created successfully',
            'company' => $company,
        ], 201);
    }
}
