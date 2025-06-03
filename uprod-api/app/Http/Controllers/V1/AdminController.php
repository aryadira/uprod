<?php

namespace App\Http\Controllers\V1;

use App\Http\Controllers\Controller;
use App\Models\V1\Major;
use App\Models\V1\User;
use App\Models\V1\Admin; // Import model Admin
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB; // Import DB Facade for transaction
use Illuminate\Validation\ValidationException; // Import ValidationException

// Anda perlu membuat Form Request ini:
// use App\Http\Requests\V1\StoreAdminRequest;
// use App\Http\Requests\V1\UpdateAdminRequest;

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

        if (!$email) {
            return response()->json([
                'status' => 'error',
                'message' => 'Parameter email diperlukan.',
            ], 400);
        }

        $user = User::query()->where('user_role_id', 2)
            ->where('email', $email)
            ->select('id', 'email')
            ->first();

        if ($user) {
            // Cek apakah sudah ada data admin untuk user ini
            $adminExists = Admin::query()->where('user_id', $user->id)->exists();

            if ($adminExists) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'User ini sudah terdaftar sebagai admin.',
                ]);
            } else {
                // Cek apakah user (sebagai admin potensial) sudah ditugaskan ke Major
                // Logika ini mungkin perlu disesuaikan tergantung relasi Major
                // Jika Major berelasi langsung ke User (admin_id di Major adalah user_id)
                $isAdminAssignedToMajor = Major::query()->where('admin_id', $user->id)->exists();

                if ($isAdminAssignedToMajor) {
                    // Sebaiknya tidak error, mungkin hanya info? Atau tergantung flow bisnis
                    return response()->json([
                        'status' => 'info', // Atau 'error' jika tidak boleh dipilih sama sekali
                        'message' => 'User ini sudah ditugaskan ke sebuah jurusan.',
                        'admin' => $user // Tetap kirim data user jika diperlukan di frontend
                    ]);
                } else {
                    return response()->json([
                        'status' => 'success',
                        'message' => 'User dapat didaftarkan sebagai admin.',
                        'admin' => $user // Mengirimkan data user yang ditemukan
                    ]);
                }
            }
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'User dengan role admin dan email tersebut tidak ditemukan.',
            ], 404); // Gunakan 404 Not Found
        }
    }

    /**
     * Store a newly created admin resource in storage.
     *
     * @param  \App\Http\Requests\V1\StoreAdminRequest  $request // Ganti Request dengan StoreAdminRequest setelah dibuat
     * @return \Illuminate\Http\JsonResponse
     */
    public function createAdmin(Request $request) // Ganti Request -> StoreAdminRequest
    {
        $data = $request->validate([
            'nik' => 'required|string|size:16|unique:admins,nik',
            'id_card_number' => 'nullable|string|size:16|unique:admins,id_card_number',
            'full_name' => 'required|string|max:255',
            'place_of_birth' => 'nullable|string|max:100',
            'date_of_birth' => 'nullable|date',
            'gender' => 'nullable|in:Male,Female',
            'address' => 'nullable|string',
            'phone_number' => 'nullable|string|max:15',
        ]);

        // Pastikan user_id yang diberikan memiliki role admin (user_role_id = 2)
        $user = User::find($data['user_id']);
        if (!$user || $user->user_role_id !== 2) {
            return response()->json([
                'status' => 'error',
                'message' => 'User yang dipilih bukan admin atau tidak ditemukan.',
            ], 422); // Unprocessable Entity
        }

        // Pastikan belum ada admin profile untuk user_id ini
        if (Admin::where('user_id', $data['user_id'])->exists()) {
            return response()->json([
                'status' => 'error',
                'message' => 'User ini sudah memiliki profil admin.',
            ], 409); // Conflict
        }

        DB::beginTransaction();
        try {
            $admin = Admin::create($data);

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Data admin berhasil dibuat.',
                'data' => $admin,
            ], 201); // 201 Created

        } catch (\Exception $e) {
            DB::rollBack();
            // Log error $e->getMessage()
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal membuat data admin: ' . $e->getMessage(), // Hati-hati expose error detail
            ], 500); // Internal Server Error
        }
    }

    /**
     * Display the specified admin resource.
     *
     * @param  int $id ID dari tabel admins
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $admin = Admin::with('user:id,name,email')->find($id); // Eager load data user

        if (!$admin) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data admin tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Data admin ditemukan.',
            'data' => $admin,
        ]);
    }


    /**
     * Update the specified admin resource in storage.
     *
     * @param  \App\Http\Requests\V1\UpdateAdminRequest  $request // Ganti Request dengan UpdateAdminRequest setelah dibuat
     * @param  int $id ID dari tabel admins
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id) // Ganti Request -> UpdateAdminRequest
    {
        $admin = Admin::find($id);

        if (!$admin) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data admin tidak ditemukan.',
            ], 404);
        }

        // --- Validasi Awal (Contoh, pindahkan ke UpdateAdminRequest) ---
        try {
            $data = $request->validate([
                // user_id tidak boleh diubah di update
                'nik' => 'required|string|size:16|unique:admins,nik,' . $admin->id, // Abaikan unique check untuk record ini sendiri
                'id_card_number' => 'nullable|string|size:16|unique:admins,id_card_number,' . $admin->id,
                'full_name' => 'required|string|max:255',
                'place_of_birth' => 'nullable|string|max:100',
                'date_of_birth' => 'nullable|date',
                'gender' => 'nullable|in:Male,Female',
                'address' => 'nullable|string',
                'phone_number' => 'nullable|string|max:15',
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data tidak valid.',
                'errors' => $e->errors(),
            ], 422);
        }
        // --- Akhir Validasi Awal ---


        DB::beginTransaction();
        try {
            $admin->update($data);
            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Data admin berhasil diperbarui.',
                'data' => $admin->fresh(), // Ambil data terbaru
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            // Log error $e->getMessage()
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal memperbarui data admin: ' . $e->getMessage(), // Hati-hati expose error detail
            ], 500);
        }
    }

    /**
     * Remove the specified admin resource from storage.
     *
     * @param  int $id ID dari tabel admins
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $admin = Admin::find($id);

        if (!$admin) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data admin tidak ditemukan.',
            ], 404);
        }

        // Tambahan: Cek relasi lain jika ada, misalnya apakah admin ini masih aktif mengelola sesuatu
        // if ($admin->hasActiveAssignments()) { // Buat method ini di model Admin jika perlu
        //     return response()->json([
        //         'status' => 'error',
        //         'message' => 'Admin tidak dapat dihapus karena masih memiliki tugas aktif.',
        //     ], 409); // Conflict
        // }

        DB::beginTransaction();
        try {
            $admin->delete();
            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Data admin berhasil dihapus.',
            ]); // Bisa juga 204 No Content jika tidak ada body response

        } catch (\Exception $e) {
            DB::rollBack();
            // Log error $e->getMessage()
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal menghapus data admin: ' . $e->getMessage(), // Hati-hati expose error detail
            ], 500);
        }
    }
}
