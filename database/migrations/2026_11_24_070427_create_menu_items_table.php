<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('menu_items', function (Blueprint $table) {
            $table->id();
            $table->string('category');
            $table->string('category_label');
            $table->string('group_label')->nullable();
            $table->string('name');
            $table->unsignedInteger('price');
            $table->string('image');
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index(['category', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('menu_items');
    }
};
