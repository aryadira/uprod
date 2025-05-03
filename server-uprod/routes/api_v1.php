<?php

use App\Http\Controllers\V1\AdminController;
use App\Http\Controllers\V1\AuthController;
use App\Http\Controllers\V1\MajorController;
use App\Http\Controllers\V1\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->name('v1.')->group(function () {
    Route::prefix('auth')->name('auth.')->group(function () {
        Route::post('signup', [AuthController::class, 'signup'])->name('signup');
        Route::post('signin', [AuthController::class, 'signin'])->name('signin');
        Route::delete('signout', [AuthController::class, 'signout'])->name('signout')->middleware('auth:sanctum');
    });

    Route::middleware('auth:sanctum')->group(function () {
        Route::prefix('user')->name('user.')->group(function () {
            Route::get('/current', [UserController::class, 'getCurrentUser'])->name('current');

            // ADMIN
            Route::get('/admin', [AdminController::class, 'getAll'])->name('admin');
            Route::get('/admin/search', [AdminController::class, 'searchAdminByEmail'])->name('admin.search');
            Route::post('/admin/create', [AdminController::class, 'createAdmin'])->name('admin.create');
            Route::get('/admin/{id}', [AdminController::class, 'getById'])->name('admin.show');
            Route::put('/admin/{id}', [AdminController::class, 'updateAdmin'])->name('admin.update');
            Route::delete('/admin/{id}', [AdminController::class, 'deleteAdmin'])->name('admin.delete');
        });

        Route::middleware('role:superadmin,admin')->group(function () {
            Route::prefix('major')->name('major.')->group(function () {
                Route::get('/', [MajorController::class, 'getAll'])->name('all');
                Route::get('/{slug}', [MajorController::class, 'getBySlug'])->name('show');
                Route::post('/create', [MajorController::class, 'createMajor'])->name('create');
            });
        });

        Route::middleware('role:customer')->group(function () {

        });
    });
});
