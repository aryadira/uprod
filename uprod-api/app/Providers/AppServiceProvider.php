<?php

namespace App\Providers;

use App\Models\V1\Major;
use App\Models\V1\User;
use App\Repositories\AuthRepository;
use App\Repositories\V1\MajorRepository;
use App\Services\V1\AuthService;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}