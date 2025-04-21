<?php

namespace App\Services\V1;

use App\Enums\UserRole;
use App\Models\V1\Customer;
use App\Models\V1\User;
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
        $user = $this->authRepository->register([
            'user_role_id' => UserRole::CUSTOMER->value,
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password'])
        ]);

        if (isset($user)) {
            Customer::create([
                'user_id' => $user->id,
                'fullname' => $user->name,
                'nik' => null,
                'no_ktp' => null,
                'email' => $user->email,
                'phone' => null,
                'gender' => null,
                'date_of_birth' => null,
                'address' => null
            ]);
        }

        return $user;
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
