<?php

namespace App\Http\Controllers\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\V1\UserLoginRequest;
use App\Http\Requests\V1\UserRegisterRequest;
use App\Services\V1\API\APIResponseService;
use App\Services\V1\AuthService;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function __construct(
        protected AuthService $authService,
        protected APIResponseService $apiResponseService
    ) {
    }

    public function signup(UserRegisterRequest $request)
    {
        $validated = $request->validated();

        $newUser = $this->authService->signup($validated);

        return $this->apiResponseService->sendSuccess('Sign up successfully!', $newUser);
    }

    public function signin(UserLoginRequest $request)
    {
        $credentials = $request->validated();

        $authenticate = $this->authService->authenticate($credentials);

        if (!$authenticate) {
            return $this->apiResponseService->sendError('Invalid email or password');
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Sign in successfully!',
            'token' => $authenticate
        ]);
    }

    public function signout(Request $request)
    {
        if (!$request->user()) {
            return $this->apiResponseService->sendUnauthorized();
        }

        $this->authService->signout($request->user());

        return $this->apiResponseService->sendSuccess('Logout successfully!');
    }
}
