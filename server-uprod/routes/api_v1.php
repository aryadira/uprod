<?php

use App\Http\Controllers\V1\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/major', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('v1')->name('v1.')->group(function () {

    Route::prefix('auth')->name('auth.')->group(function () {
        Route::post('signin', [AuthController::class, 'signin'])->name('signin');
        Route::delete('signout', [AuthController::class, 'signout'])->name('signout')->middleware('auth:sanctum');
    });

    Route::middleware('auth:sanctum')->group(function () {
        Route::middleware('role:admin')->group(function () {

        });
    });
});
