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
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->string('fullname');
            $table->string('nik')->unique(); // Pastikan NIK unik
            $table->string('no_ktp')->unique(); // Pastikan nomor KTP unik
            $table->string('email')->nullable()->unique(); // Menambahkan email
            $table->string('phone')->nullable(); // Menambahkan nomor telepon
            $table->text('address')->nullable(); // Menambahkan alamat
            $table->timestamps();
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
