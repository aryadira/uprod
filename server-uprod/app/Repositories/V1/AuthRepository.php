<?php

namespace App\Repositories\V1;

use App\Models\V1\User;

class AuthRepository
{


    public function __construct
    (
        protected User $user
    ) {

    }

    public function register(array $data): User
    {
        return $this->user->create($data);
    }

    public function findByEmail(string $email): ?User
    {
        return $this->user->where('email', $email)->first();
    }

    public function findByUsername(string $username): ?User
    {
        return $this->user->where('username', $username)->first();
    }
}
