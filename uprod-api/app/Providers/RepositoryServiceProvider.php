<?php

namespace App\Providers;

use App\Repositories\V1\MajorRepository;
use App\Repositories\V1\ProductRepository;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind(
            MajorRepository::class,
            MajorRepository::class
        );

        $this->app->bind(
            ProductRepository::class,
            ProductRepository::class
        );
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}