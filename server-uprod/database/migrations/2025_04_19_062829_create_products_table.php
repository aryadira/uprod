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
            // $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');

            $table->string('name');
            $table->string('slug');
            $table->string('code')->unique();
            $table->decimal('price', 10, 2);
            $table->integer('stock')->default(0);
            $table->text('description');
            // $table->enum('status', ['available', 'out_of_stock', 'low_stock'])->default('out_of_stock');
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
        Schema::dropIfExists('products');
    }
};
