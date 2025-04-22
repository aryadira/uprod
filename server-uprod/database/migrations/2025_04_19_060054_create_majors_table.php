<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('majors', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('admin_id')->nullable();

            $table->string('slug');
            $table->string('logo_path', 100)->nullable();
            $table->string('banner_path', 100)->nullable();
            $table->string('name', 100);
            $table->string('acronim', 10);
            $table->text('description')->nullable()->default('No description for this major.');
            $table->timestamps();

            $table->foreign('admin_id')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('majors');
    }
};
