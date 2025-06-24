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
        Schema::create('invoice_workorder_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('invoice_workorder_id');
            $table->string('item_name');
            $table->decimal('item_price', 15, 2)->default(0);
            $table->unsignedInteger('item_qty')->default(0);
            $table->decimal('item_price_amount', 15, 2)->default(0);
            $table->timestamps();

            $table->foreign('invoice_workorder_id')->references('id')->on('invoice_workorders')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoice_workorder_items');
    }
};
