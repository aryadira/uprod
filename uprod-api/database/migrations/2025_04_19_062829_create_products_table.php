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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('major_id')->nullable(false);

            $table->string('code')->unique();
            $table->string('name')->nullable(false);
            $table->string('slug')->nullable(false);
            $table->decimal('price', 10, 2)->nullable(false)->default(0);
            $table->integer('stock')->default(0);
            $table->text('description')->default("Tidak ada deskripsi yang ditampilkan.");
            $table->enum('availability', ['available', 'out_of_stock', 'low_stock'])->default('out_of_stock');
            $table->boolean('is_active')->default(false);
            $table->timestamps();

            $table->foreign('major_id')->references('id')->on('majors')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
