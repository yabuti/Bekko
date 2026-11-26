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
        Schema::table('orders', function (Blueprint $table) {
            $table->foreignId('cafe_table_id')->nullable()->change();
            $table->string('customer_name')->nullable()->after('cafe_table_id');
            $table->string('order_type')->default('dine_in')->after('customer_name');
            $table->string('delivery_location')->nullable()->after('order_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['customer_name', 'order_type', 'delivery_location']);
            $table->foreignId('cafe_table_id')->nullable(false)->change();
        });
    }
};
