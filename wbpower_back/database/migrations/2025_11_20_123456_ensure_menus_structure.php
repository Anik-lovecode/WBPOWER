<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class EnsureMenusStructure extends Migration
{
    public function up()
    {
        Schema::table('menus', function (Blueprint $table) {
            if (!Schema::hasColumn('menus', 'parent_id')) {
                $table->unsignedBigInteger('parent_id')->nullable();
            }
            if (!Schema::hasColumn('menus', 'position')) {
                $table->integer('position')->default(0);
            }
            if (!Schema::hasColumn('menus', 'is_active')) {
                $table->boolean('is_active')->default(true);
            }
            if (!Schema::hasColumn('menus', 'created_at')) {
                $table->timestamp('created_at')->nullable();
            }
            if (!Schema::hasColumn('menus', 'updated_at')) {
                $table->timestamp('updated_at')->nullable();
            }
        });

        // Add FK constraint if missing (Postgres-specific check)
        DB::statement(<<<'SQL'
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint con
    JOIN pg_class rel ON rel.oid = con.conrelid
    JOIN pg_attribute att ON att.attrelid = rel.oid AND att.attnum = ANY(con.conkey)
    WHERE rel.relname = 'menus' AND att.attname = 'parent_id' AND con.contype = 'f'
  ) THEN
    ALTER TABLE menus
      ADD CONSTRAINT fk_menus_parent
      FOREIGN KEY (parent_id) REFERENCES menus(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE;
  END IF;
END$$;
SQL
        );
    }

    public function down()
    {
        Schema::table('menus', function (Blueprint $table) {
            if (Schema::hasColumn('menus', 'position')) {
                $table->dropColumn('position');
            }
            if (Schema::hasColumn('menus', 'is_active')) {
                $table->dropColumn('is_active');
            }
            // cautious: don't drop parent_id automatically to avoid data loss
        });

        DB::statement(<<<'SQL'
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint con
    JOIN pg_class rel ON rel.oid = con.conrelid
    JOIN pg_attribute att ON att.attrelid = rel.oid AND att.attnum = ANY(con.conkey)
    WHERE rel.relname = 'menus' AND att.attname = 'parent_id' AND con.contype = 'f'
  ) THEN
    ALTER TABLE menus DROP CONSTRAINT IF EXISTS fk_menus_parent;
  END IF;
END$$;
SQL
        );
    }
}
