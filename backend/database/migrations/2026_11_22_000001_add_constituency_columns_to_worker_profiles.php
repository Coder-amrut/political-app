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
        if (Schema::hasTable('worker_profiles')) {
            Schema::table('worker_profiles', function (Blueprint $table) {
                if (!Schema::hasColumn('worker_profiles', 'assembly')) {
                    $table->string('assembly')->nullable()->after('primary_booths');
                }
                if (!Schema::hasColumn('worker_profiles', 'lok_sabha')) {
                    $table->string('lok_sabha')->nullable()->after('assembly');
                }
                if (!Schema::hasColumn('worker_profiles', 'state')) {
                    $table->string('state')->nullable()->default('महाराष्ट्र')->after('lok_sabha');
                }
                if (!Schema::hasColumn('worker_profiles', 'district')) {
                    $table->string('district')->nullable()->default('सांगली')->after('state');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('worker_profiles')) {
            Schema::table('worker_profiles', function (Blueprint $table) {
                if (Schema::hasColumn('worker_profiles', 'district')) {
                    $table->dropColumn('district');
                }
                if (Schema::hasColumn('worker_profiles', 'state')) {
                    $table->dropColumn('state');
                }
                if (Schema::hasColumn('worker_profiles', 'lok_sabha')) {
                    $table->dropColumn('lok_sabha');
                }
                if (Schema::hasColumn('worker_profiles', 'assembly')) {
                    $table->dropColumn('assembly');
                }
            });
        }
    }
};
