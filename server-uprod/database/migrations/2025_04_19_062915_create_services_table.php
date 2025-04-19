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
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('major_id')->nullable(false);
            // $table->unsignedBigInteger('category_id')->nullable(false);

            $table->string('name');
            $table->string('slug');
            $table->string('code')->unique();
            $table->decimal('price', 10, 2);
            $table->integer('stock')->default(0);
            // $table->enum('status', ['available', 'limited', 'low_stock', 'out_of_stock'])->default('out_of_stock');
            $table->timestamps();

            $table->foreign('major_id')->references('id')->on('majors')->onDelete('cascade');
            // $table->foreign('category_id')->references('id')->on('categories');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
