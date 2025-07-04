<?php

namespace App\Http\Controllers\V1;

use App\Http\Controllers\Controller;
use App\Models\V1\Major;
use App\Models\V1\User;
use App\Services\V1\API\APIService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function __construct(protected APIService $APIService)
    {
    }

    public function getCurrentUser()
    {
        $authUser = request()->user();

        $roles = [
            1 => 'superadmin',
            2 => 'admin',
            3 => 'customer',
        ];

        $roleName = $roles[$authUser->user_role_id] ?? null;

        $currentUser = [
            'name' => $authUser->name,
            'email' => $authUser->email,
            'role' => $roleName,
        ];

        return response()->json([
            'status' => 'success',
            'message' => 'Get current user',
            'user' => $currentUser
        ]);
    }


    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
