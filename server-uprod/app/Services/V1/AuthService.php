<?php

namespace App\Services\V1;

use App\Repositories\V1\AuthRepository;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthService
{
    public function __construct(protected AuthRepository $authRepository)
    {
    }

    public function signup(array $data)
    {
        // $user = $this->authRepository->register([
        //     'name' => $data['name'],
        //     ''
        // ])
    }

    public function authenticate($credentials): string|null
    {
        $email = $credentials['email'];
        $password = $credentials['password'];

        if (!isset($email, $password)) {
            return null;
        }

        $userAuth = $this->authRepository->findByEmail($email);

        if (!$userAuth || !Hash::check($password, $userAuth->password)) {
            return null;
        }

        $token = $userAuth->createToken('auth_token')->plainTextToken;

        return $token;
    }

    public function signout($currentUser)
    {
        return $currentUser->currentAccessToken()->delete();
    }
}
