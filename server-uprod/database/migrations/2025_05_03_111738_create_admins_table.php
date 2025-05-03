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
        Schema::create('admins', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->unique(); // Foreign key to the users table
            $table->string('nik', 16)->unique()->nullable(); // National Identity Number
            $table->string('no_ktp', 16)->unique()->nullable(); // KTP Number (no_ktp)
            $table->string('full_name'); // nama_lengkap
            $table->string('place_of_birth')->nullable(); // tempat_lahir
            $table->date('date_of_birth')->nullable(); // tanggal_lahir
            $table->enum('gender', ['male', 'female'])->nullable(); // jenis_kelamin
            $table->text('address')->nullable(); // alamat
            $table->string('phone_number', 15)->nullable(); // no_telepon
            // Add other relevant columns here
            $table->timestamps(); // Adds created_at and updated_at columns

            // Define the foreign key constraint
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

            // Add indexes if needed for query performance
            $table->index('nik');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admins');
    }
};