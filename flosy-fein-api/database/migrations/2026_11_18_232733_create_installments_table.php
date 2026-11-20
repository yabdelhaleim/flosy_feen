<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('installments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title', 255);
            $table->decimal('amount', 10, 2);
            $table->enum('type', ['one_time', 'recurring']);
            $table->date('start_date');
            $table->tinyInteger('total_installments')->nullable()->comment('فقط للمتكرر');
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('installments');
    }
};