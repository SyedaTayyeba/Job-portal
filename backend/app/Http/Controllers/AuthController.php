<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate(
            [
                'name' => 'required|string|max:25',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|string|min:8',
                'role' => 'required|in:employer,job_seeker',
            ]
        );
        $user = User::create(
            [
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => $validated['password'],
                'role' => $validated['role'],
            ]
        );
        return response()->json([
            'message' => 'User created successfully',
            'user' => $user,
        ], 201);
    }
    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string|min:8',
        ]);
        $result = Auth::attempt([
            'email' => $validated['email'],
            'password' => $validated['password'],
        ]);
        if ($result === false) {
            return response()->json([
                'message' => 'Invalid Credentials',
            ], 401);
        }
        $user = Auth::user(); //returns the authenticated user
        $token = $user->createToken('auth_token')->plainTextToken;
        return response()->json([
            'message' => 'Token generated successfully',
            'user' => $user,
            'token' => $token,

        ], 200);
    }
    public function logout(Request $request){
        $request->user()->currentAccessToken()->delete();
        return response()->json([
            'message' => 'Logged out successfully',
        ], 200);
    }
}
