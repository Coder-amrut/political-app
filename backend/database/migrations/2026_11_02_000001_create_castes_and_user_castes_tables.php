<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. castes master table
        if (! Schema::hasTable('castes')) {
            Schema::create('castes', function (Blueprint $table) {
                $table->id();
                $table->string('caste_name_mr', 100)->index();
                $table->string('caste_name_en', 100)->index();
                $table->string('category', 50)->default('OPEN')->index(); // OPEN, OBC, SC, ST, VJNT, NT-B, NT-C, NT-D, SBC, EWS, OTHER
                $table->string('description', 255)->nullable();
                $table->boolean('is_active')->default(true)->index();
                $table->timestamps();
            });
        }

        // 2. user_castes table — storing the caste of users
        if (! Schema::hasTable('user_castes')) {
            Schema::create('user_castes', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('user_id')->index();
                $table->unsignedBigInteger('caste_id')->nullable()->index();
                $table->string('caste_name', 100);
                $table->string('sub_caste', 100)->nullable();
                $table->string('category', 50)->nullable()->default('OPEN');
                $table->string('certificate_no', 100)->nullable();
                $table->text('notes')->nullable();
                $table->timestamps();

                $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
            });
        }

        // 3. Add caste and caste_category columns to users if missing
        if (Schema::hasTable('users')) {
            Schema::table('users', function (Blueprint $table) {
                if (! Schema::hasColumn('users', 'caste')) {
                    $table->string('caste', 100)->nullable()->after('phone');
                }
                if (! Schema::hasColumn('users', 'caste_category')) {
                    $table->string('caste_category', 50)->nullable()->after('caste');
                }
            });
        }

        // 4. Add caste columns to worker_profiles if missing
        if (Schema::hasTable('worker_profiles')) {
            Schema::table('worker_profiles', function (Blueprint $table) {
                if (! Schema::hasColumn('worker_profiles', 'caste')) {
                    $table->string('caste', 100)->nullable();
                }
                if (! Schema::hasColumn('worker_profiles', 'sub_caste')) {
                    $table->string('sub_caste', 100)->nullable();
                }
                if (! Schema::hasColumn('worker_profiles', 'caste_category')) {
                    $table->string('caste_category', 50)->nullable();
                }
            });
        }

        // 5. Add caste column to worker_survey_responses if missing
        if (Schema::hasTable('worker_survey_responses')) {
            Schema::table('worker_survey_responses', function (Blueprint $table) {
                if (! Schema::hasColumn('worker_survey_responses', 'caste')) {
                    $table->string('caste', 100)->nullable()->after('citizen_name');
                }
                if (! Schema::hasColumn('worker_survey_responses', 'caste_category')) {
                    $table->string('caste_category', 50)->nullable()->after('caste');
                }
            });
        }

        // 6. Seed comprehensive list of castes
        $initialCastes = [
            ['caste_name_mr' => 'मराठा', 'caste_name_en' => 'Maratha', 'category' => 'OPEN'],
            ['caste_name_mr' => 'कुणबी', 'caste_name_en' => 'Kunbi', 'category' => 'OBC'],
            ['caste_name_mr' => 'माळी', 'caste_name_en' => 'Mali', 'category' => 'OBC'],
            ['caste_name_mr' => 'धनगर', 'caste_name_en' => 'Dhangar', 'category' => 'NT-C'],
            ['caste_name_mr' => 'वंजारी', 'caste_name_en' => 'Vanjari', 'category' => 'NT-D'],
            ['caste_name_mr' => 'लिंगायत', 'caste_name_en' => 'Lingayat', 'category' => 'OPEN'],
            ['caste_name_mr' => 'ब्राह्मण', 'caste_name_en' => 'Brahmin', 'category' => 'OPEN'],
            ['caste_name_mr' => 'चांभार', 'caste_name_en' => 'Chambhar', 'category' => 'SC'],
            ['caste_name_mr' => 'मातंग', 'caste_name_en' => 'Matang', 'category' => 'SC'],
            ['caste_name_mr' => 'नवबौद्ध / बौद्ध', 'caste_name_en' => 'Buddhist / Neo-Buddhist', 'category' => 'SC'],
            ['caste_name_mr' => 'भिल्ल', 'caste_name_en' => 'Bhil', 'category' => 'ST'],
            ['caste_name_mr' => 'महादेव कोळी', 'caste_name_en' => 'Mahadev Koli', 'category' => 'ST'],
            ['caste_name_mr' => 'जैन', 'caste_name_en' => 'Jain', 'category' => 'OPEN'],
            ['caste_name_mr' => 'मुस्लिम', 'caste_name_en' => 'Muslim', 'category' => 'OBC'],
            ['caste_name_mr' => 'मारवाडी', 'caste_name_en' => 'Marwari', 'category' => 'OPEN'],
            ['caste_name_mr' => 'तेली', 'caste_name_en' => 'Teli', 'category' => 'OBC'],
            ['caste_name_mr' => 'सुतार', 'caste_name_en' => 'Sutar', 'category' => 'OBC'],
            ['caste_name_mr' => 'लोहार', 'caste_name_en' => 'Lohar', 'category' => 'NT-B'],
            ['caste_name_mr' => 'कुंभार', 'caste_name_en' => 'Kumbhar', 'category' => 'OBC'],
            ['caste_name_mr' => 'न्हावी', 'caste_name_en' => 'Nhavi', 'category' => 'OBC'],
            ['caste_name_mr' => 'धोबी', 'caste_name_en' => 'Dhobi', 'category' => 'OBC'],
            ['caste_name_mr' => 'आगरी', 'caste_name_en' => 'Agri', 'category' => 'OBC'],
            ['caste_name_mr' => 'कोष्टी', 'caste_name_en' => 'Koshti', 'category' => 'SBC'],
            ['caste_name_mr' => 'कैकाडी', 'caste_name_en' => 'Kaikadi', 'category' => 'VJNT'],
            ['caste_name_mr' => 'इतर', 'caste_name_en' => 'Other', 'category' => 'OTHER'],
        ];

        foreach ($initialCastes as $caste) {
            DB::table('castes')->updateOrInsert(
                ['caste_name_en' => $caste['caste_name_en']],
                [
                    'caste_name_mr' => $caste['caste_name_mr'],
                    'category'      => $caste['category'],
                    'is_active'     => true,
                    'created_at'    => now(),
                    'updated_at'    => now(),
                ]
            );
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_castes');
        Schema::dropIfExists('castes');
    }
};
