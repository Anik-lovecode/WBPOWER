<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Spatie\Permission\Models\Role;

class AuthController extends Controller
{
     public function register(Request $request)
            {
              Log::info('Register method called with data: ', $request->all());
                try {
                    $request->validate([
                        'name' => 'required|string|max:255',
                        'email' => 'required|string|email|max:255|unique:users',
                        // phone: accepts exactly 10 digits if provided
                        'phone' => 'nullable|digits:10',
                        'password' => 'required|string|min:8|confirmed',
                        'user_address' => 'required|string|max:255',
                        'user_image' => 'nullable|image|mimes:jpg,png,jpeg|max:2048',
                        'user_role' => 'nullable|string',
                    ], [
                        'phone.digits' => 'Mobile number must be exactly 10 digits.',
                        'password.confirmed' => 'Passwords do not match.',
                    ]);

                    $user = User::create([
                        'name' => $request->name,
                        'email' => $request->email,
                        'phone' => $request->phone,
                        'password' => Hash::make($request->password),
                    ]);
                    // Determine role -- default to `user` if not provided
                    $user_role = $request->user_role ?: 'user';
                    $role = Role::where('name', $user_role)->where('guard_name', 'api')->first();

                    if (!$role) {
                        // Fail gracefully if role not found
                        return response()->json(['error' => 'Role not found or invalid guard.'], 422);
                    }

                    // Assign role to user
                    $user->assignRole($role);

                    // Create additional details record
                    $additionalData = [
                        'user_id' => $user->id,
                        'user_address' => $request->user_address,
                        'user_image' => null,
                    ];

                    // Handle optional user image upload
                    if ($request->hasFile('user_image')) {
                        $imageName = time() . '.' . $request->file('user_image')->extension();
                        $request->file('user_image')->move(public_path('images/user'), $imageName);
                        $additionalData['user_image'] = 'images/user/' . $imageName;
                    }

                    \App\Models\UserAdditionalDetails::create($additionalData);
                    
                    try {
                        $token = $user->createToken('authToken')->accessToken;
                    } catch (\Throwable $e) {
                        Log::error('Token generation failed for user ' . $user->id, ['error' => $e->getMessage()]);
                        return response()->json(['message' => 'Token generation failed. Make sure Passport keys are installed and valid.'], 500);
                    }

                    // Return the user with additional details
                    return response()->json(['user' => $user->load('additionalDetail'), 'access_token' => $token]);
                }
                catch (ValidationException $e) {
                        return response()->json([
                            'errors' => $e->errors()
                        ], 422);
                    }
            }
                

    public function login(Request $request)
        {
                try {
                    $credentials = $request->validate([
                        'email' => 'required|string|email',
                        'password' => 'required|string',
                    ]);
                    Log::info('Login attempt for email: ' . $credentials['email']);
                    if (!Auth::attempt($credentials)) {
                        return response()->json(['message' => 'Unauthorized'], 401);
                    }

                    $user = $request->user();
                    Log::info('Login user: ' . $user );
                    try {
                        $token = $user->createToken('authToken')->accessToken;
                    } catch (\Throwable $e) {
                        Log::error('Token generation failed for login attempt', ['error' => $e->getMessage()]);
                        return response()->json(['message' => 'Token generation failed. Make sure Passport keys are installed and valid.'], 500);
                    }

                    return response()->json(['user' => $user, 'access_token' => $token]);
                }
                catch (ValidationException $e) {
                        return response()->json([
                            'errors' => $e->errors()
                        ], 422);
                    }
        }
     public function logout(Request $request)
        {
            $user = Auth::user();
            
            $user->token()->revoke(); // Revoke the current access token

            return response()->json([
                'success' => true,
                'message' => 'Successfully logged out'
            ], 200);
            
        }
     
}
