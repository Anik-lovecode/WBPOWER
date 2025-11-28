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
        if (!Schema::hasColumn('post_categories', 'custompost_table_name')) {
            Schema::table('post_categories', function (Blueprint $table) {
                $table->string('custompost_table_name')->nullable()->after('category_parent');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('post_categories', 'custompost_table_name')) {
            Schema::table('post_categories', function (Blueprint $table) {
                $table->dropColumn('custompost_table_name');
            });
        }
    }
};
