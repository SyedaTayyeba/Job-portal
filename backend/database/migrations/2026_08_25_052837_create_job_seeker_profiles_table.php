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
       Schema::create('job_seeker_profiles', function (Blueprint $table) {
    $table->id();

    $table->foreignId('user_id')
        ->unique()
        ->constrained('users')
        ->onDelete('cascade');

    $table->string('phone')->nullable();
    $table->string('location')->nullable();

    $table->text('bio')->nullable();

    $table->text('skills')->nullable();

    $table->text('education')->nullable();

    $table->text('experience')->nullable();

    $table->string('resume')->nullable();

    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_seeker_profiles');
    }
};
