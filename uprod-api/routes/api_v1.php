<?php

use App\Http\Controllers\V1\AdminController;
use App\Http\Controllers\V1\AuthController;
use App\Http\Controllers\V1\MajorController;
use App\Http\Controllers\V1\ProductController;
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
            Route::prefix('admin')->name('admin.')->group(function () {
                Route::get('/', [AdminController::class, 'getAll'])->name('admin');
                Route::get('/search', [AdminController::class, 'searchAdminByEmail'])->name('search');
                Route::post('/create', [AdminController::class, 'createAdmin'])->name('create');
                Route::get('/{id}', [AdminController::class, 'getById'])->name('details');
                Route::put('/{id}', [AdminController::class, 'updateAdmin'])->name('update');
                Route::delete('/{id}', [AdminController::class, 'deleteAdmin'])->name('delete');
            });
        });

        Route::middleware('role:superadmin,admin')->group(function () {
            Route::prefix('major')->name('major.')->group(function () {
                Route::get('/', [MajorController::class, 'getAll'])->name('all');
                Route::get('/{slug}', [MajorController::class, 'getBySlug'])->name('details');
                Route::post('/create', [MajorController::class, 'createMajor'])->name('create');
            });

            Route::prefix('product')->name('product.')->group(function () {
                Route::get('/', [ProductController::class, 'getAll'])->name('all');
                Route::get('/{id}', [ProductController::class, 'getById'])->name('details');
                Route::post('/create', [ProductController::class, 'createProduct'])->name(name: 'create');
            });
        });

        Route::middleware('role:customer')->group(function () {

        });
    });
});