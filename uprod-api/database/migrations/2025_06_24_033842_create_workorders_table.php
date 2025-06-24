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
        Schema::create('workorders', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('wo_number')->unique();
            $table->string('wo_name');
            $table->string('wo_description')->nullable()->default('Tidak ada deskripsi.');
            $table->enum('wo_status', ['pending', 'approved', 'processing', 'completed', 'cancelled'])->default('pending');
            $table->string('wo_note')->nullable()->default('Tidak ada catatan.');

            $table->decimal('subtotal', 15, 2)->default(0);
            $table->decimal('tax_percentage', 3, 2)->default(0);
            $table->decimal('tax_price', 15, 2)->default(0);
            $table->decimal('grand_total', 15, 2)->default(0);

            $table->timestamp('wo_at')->useCurrent();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('workorders');
    }
};
