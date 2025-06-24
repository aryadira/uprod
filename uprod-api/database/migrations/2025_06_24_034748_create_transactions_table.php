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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('invoice_id');
            $table->unsignedBigInteger('payment_method_id');
            $table->unsignedBigInteger('bank_id')->nullable();
            $table->string('transaction_type'); // order / wo / booking / etc
            $table->string('transaction_number');
            $table->string('note')->nullable()->default('Tidak ada catatan.');
            $table->decimal('amount', 15, 2)->default(0);
            $table->string('account_number')->nullable();
            $table->string('payment_method_string')->nullable();
            $table->string('bank_name_string')->nullable();
            $table->string('invoice_number_string')->nullable();
            $table->timestamp('paid_at');
            $table->string('created_by')->nullable()->default('system');
            $table->string('updated_by')->nullable()->default('system');
            $table->timestamps();

            $table->foreign('payment_method_id')->references('id')->on('payment_methods');
            $table->foreign('bank_id')->references('id')->on('banks');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
