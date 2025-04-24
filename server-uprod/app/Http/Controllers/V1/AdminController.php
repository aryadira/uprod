<?php

namespace App\Http\Controllers\V1;

use App\Http\Controllers\Controller;
use App\Models\V1\Major;
use App\Models\V1\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
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
