<?php

namespace Database\Seeders;

use App\Models\V1\UserRole;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            [
                "id" => 1,
                "role_name" => 'superadmin'
            ],
            [
                "id" => 2,
                "role_name" => 'admin'
            ],
            [
                "id" => 3,
                "role_name" => 'customer'
            ],
            [
                "id" => 4,
                "role_name" => 'guest'
            ],
        ];

        foreach ($roles as $role) {
            UserRole::create($role);
        }
    }
}
