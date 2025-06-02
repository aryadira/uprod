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
    public const USER_NOT_REGISTERED = 'user_not_registered';

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

    public function authenticate(array $credentials): ?string
    {
        if (empty($credentials['email']) || empty($credentials['password'])) {
            return null;
        }

        $user = $this->authRepository->findByEmail($credentials['email']);

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return null;
        }

        if ($this->isUnregisteredAdmin($user)) {
            return self::USER_NOT_REGISTERED;
        }

        return $user->createToken('auth_token')->plainTextToken;
    }

    private function isUnregisteredAdmin($user): bool
    {
        return $user->user_role_id === 2 && $user->majors()->count() === 0;
    }

    public function signout($currentUser)
    {
        return $currentUser->currentAccessToken()->delete();
    }
}
