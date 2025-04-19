<?php

namespace App\Providers;

use App\Models\V1\Major;
use App\Repositories\V1\MajorRepository;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(MajorRepository::class, function ($app) {
            return new MajorRepository(new Major());
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
