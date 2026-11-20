<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('email', 255)->unique();
            $table->string('password')->nullable();
            $table->string('google_id')->nullable()->unique();
            $table->string('avatar', 500)->nullable();
            $table->decimal('salary_amount', 10, 2)->nullable();
            $table->tinyInteger('salary_day')->nullable()->comment('1-31');
            $table->timestamp('email_verified_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};