<?php

namespace Database\Seeders;

use App\Models\V1\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                "id" => 1,
                'user_role_id' => 1,
                "name" => 'superadmin',
                'email' => 'superadmin@test.com',
                'email_verified_at' => null,
                'password' => Hash::make('12345678')
            ],
            [
                "id" => 2,
                'user_role_id' => 2,
                "name" => 'admin',
                'email' => 'admin@test.com',
                'email_verified_at' => null,
                'password' => Hash::make('12345678')
            ],
            [
                "id" => 3,
                'user_role_id' => 3,
                "name" => 'customer',
                'email' => 'customer@test.com',
                'email_verified_at' => null,
                'password' => Hash::make('12345678')
            ],
        ];

        foreach ($users as $user) {
            User::create(attributes: $user);
        }
    }
}
