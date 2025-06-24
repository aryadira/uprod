<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('fullname');
            $table->string('nik')->unique()->nullable(); // Pastikan NIK unik
            $table->string('no_ktp')->unique()->nullable(); // Pastikan nomor KTP unik
            $table->string('contact_email')->unique()->nullable(); // Menambahkan email
            $table->string('mobile_number')->nullable(); // Menambahkan nomor telepon
            $table->enum('gender', ['male', 'female'])->nullable();
            $table->date('date_of_birth')->nullable();
            $table->text('address')->nullable(); // Menambahkan alamat
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

            $table->index('nik');
            $table->index('no_ktp');
            $table->index('contact_email');
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
