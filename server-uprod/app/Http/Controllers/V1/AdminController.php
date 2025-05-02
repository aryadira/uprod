<?php

namespace App\Http\Controllers\V1;

use App\Http\Controllers\Controller;
use App\Models\V1\Major;
use App\Models\V1\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function getAll()
    {
        $admins = User::query()->where('user_role_id', 2)
            ->select('id', 'name', 'email')
            ->get();

        // Tambahkan informasi apakah admin sudah digunakan
        $admins = $admins->map(function ($admin) {
            $isAdminUsed = Major::query()->where('admin_id', $admin->id)->exists();
            $admin->is_assigned = $isAdminUsed ? 'assigned' : 'unassigned';
            return $admin;
        });

        return response()->json([
            'status' => 'success',
            'message' => 'Get all admin!',
            'admins' => $admins
        ]);
    }

    public function getById($id)
    {
        $admin = User::query()->where('user_role_id', 2)
            ->where('id', $id)
            ->first();

        return response()->json([
            'status' => 'success',
            'message' => 'Get single admin!',
            'admin' => $admin
        ]);
    }

    public function searchAdminByEmail(Request $request)
    {
        $email = $request->query('email');

        $admin = User::query()->where('user_role_id', 2)
            ->where('email', $email)
            ->select('id', 'email')
            ->first();

        if (isset($admin)) {
            $isAdminUsed = Major::query()->where('admin_id', $admin->id)->exists();

            if ($isAdminUsed) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Admin sudah digunakan di major ini.',
                ]);
            } else {
                return response()->json([
                    'status' => 'success',
                    'message' => 'Admin dapat digunakan.',
                    'admin' => $admin
                ]);
            }
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Admin tidak ditemukan.',
            ]);
        }
    }
}