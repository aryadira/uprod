<?php

namespace App\Http\Controllers\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\V1\UserLoginRequest;
use App\Http\Requests\V1\UserRegisterRequest;
use App\Services\V1\API\APIService;
use App\Services\V1\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function __construct(
        protected AuthService $authService,
        protected APIService $APIService
    ) {
    }

    public function signup(UserRegisterRequest $request)
    {
        $validated = $request->validated();

        $newUser = $this->authService->signup($validated);

        return $this->APIService->sendSuccess('Sign up successfully!', $newUser);
    }

    public function signin(UserLoginRequest $request): JsonResponse
    {
        $credentials = $request->validated();

        $token = $this->authService->authenticate($credentials);

        if ($token === AuthService::USER_NOT_REGISTERED) {
            Auth::logout();
            return response()->json([
                'message' => 'Admin belum terdaftar di major',
            ], 403);
        }

        if (!$token) {
            return $this->APIService->sendError('Invalid email or password');
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Sign in successfully!',
            'token' => $token,
        ]);
    }


    public function signout(Request $request)
    {
        if (!$request->user()) {
            return $this->APIService->sendUnauthorized();
        }

        $this->authService->signout($request->user());

        return $this->APIService->sendSuccess('Logout successfully!');
    }
}
