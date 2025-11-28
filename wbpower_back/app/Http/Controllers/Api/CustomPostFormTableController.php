<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Schema\Blueprint;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;
use Log;


class CustomPostFormTableController extends Controller
{
    // API for creating a dynamic table
    public function createCustomPostTable(Request $request)
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 401);
            }

            $tableName = $request->input('table_name');
            $fields = $request->input('fields');
            $categoryId = $request->input('category_id');
            // allow optional category_name from frontend, but prefer DB lookup when updating post_categories
            $categoryNameInput = $request->input('category_name');

            if (empty($tableName) || empty($fields) || !is_array($fields)) {
                return response()->json(['error' => 'Invalid input'], 400);
            }

            $tableName = 'custompost_' . Str::snake(strtolower($tableName));

            if (Schema::hasTable($tableName)) {
                return response()->json(['error' => 'Table already exists'], 400);
            }

            // Ensure category_id and category_name columns exist in created table
            if (is_array($fields)) {
                $hasCategoryId = false;
                $hasCategoryName = false;
                foreach ($fields as $f) {
                    if (is_array($f) && isset($f['name']) && Str::snake(strtolower($f['name'])) == 'category_id') $hasCategoryId = true;
                    if (is_array($f) && isset($f['name']) && Str::snake(strtolower($f['name'])) == 'category_name') $hasCategoryName = true;
                    if (is_string($f)) {
                        // string key-value format handled elsewhere; best-effort skip
                    }
                }
                if (!$hasCategoryId) $fields[] = ['name' => 'category_id', 'type' => 'integer'];
                if (!$hasCategoryName) $fields[] = ['name' => 'category_name', 'type' => 'string'];
            }

            Schema::create($tableName, function (Blueprint $table) use ($fields, $tableName) {
                $table->id();
                foreach ($fields as $index => $field) {

                    // CASE 1: Key-value format
                    if (is_string($field)) {
                        $fieldName = Str::snake(strtolower($index));
                        $fieldType = strtolower($field);
                    }
                    // CASE 2: Array format from frontend
                    elseif (is_array($field) && isset($field['name'], $field['type'])) {
                        $fieldName = Str::snake(strtolower($field['name']));
                        $fieldType = strtolower($field['type']);
                    }
                    else {
                        Log::error("Invalid field format: " . json_encode($field));
                        continue;
                    }

                    // 🛑 SKIP duplicate system fields
                    if (in_array($fieldName, ['id', 'is_active', 'created_at', 'updated_at'])) {
                        Log::warning("Skipping reserved field: $fieldName");
                        continue;
                    }

                    // CREATE COLUMN
                    switch ($fieldType) {
                        case 'string': $table->string($fieldName)->nullable(); break;
                        case 'integer': $table->integer($fieldName)->nullable(); break;
                        case 'text':
                        case 'textarea': $table->text($fieldName)->nullable(); break;
                        case 'ckeditor':
                        case 'richtext': $table->longText($fieldName)->nullable(); break;
                        case 'boolean': $table->boolean($fieldName)->default(false); break;
                        case 'date': $table->date($fieldName)->nullable(); break;
                        case 'file': $table->string($fieldName)->nullable(); break;
                        default: $table->string($fieldName)->nullable();
                    }
                }
                $table->boolean('is_active')->default(1);
                $table->timestamps();
            });
            Log::info("table created: {$tableName} with fields: " . json_encode($fields));

            // If category_id was provided, save created table name into post_categories.custompost_table_name
            try {
                if ($categoryId) {
                    $existing = DB::table('post_categories')->where('id', $categoryId)->first();
                    if ($existing) {
                        DB::table('post_categories')->where('id', $categoryId)->update([
                            'custompost_table_name' => $tableName,
                            'updated_at' => now(),
                        ]);
                    }
                }
            } catch (\Exception $e) {
                Log::warning('Failed to update post_categories.custompost_table_name: ' . $e->getMessage());
            }

            return response()->json(['success' => "Table '$tableName' created successfully"]);

        } catch (ValidationException $e) {
            Log::error("Validation error: " . json_encode($e->errors()));
            return response()->json([
                'success' => false,
                'errors'  => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error("exception error: " . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function getCustomPostTables()
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 401);
            }
            $prefix = 'custompost_';

            $tables = DB::select("
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_type = 'BASE TABLE'
            ");
            

            // Filter the objects where table_name starts with prefix
            $customTables = array_filter($tables, function($table) use ($prefix) {
                return str_starts_with($table->table_name, $prefix);
            });
            

            // Reindex array keys from 0
            $customTables = array_values($customTables);

                return response()->json([
                    'success' => true,
                    'data' => $customTables,
                    'message' => 'All Post List!'
                ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors'  => $e->errors()
            ], 422);
        }
    }
    public function getFormFields($tableName)
    {
        try{
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 401);
        }

        if (!Schema::hasTable($tableName)) {
            return response()->json(['error' => 'Table not found'], 404);
        }

        $columns = Schema::getColumnListing($tableName);
        $fields = [];
        Log::info("Columns in table {$tableName}: " . json_encode($columns));
        // Columns to detect as files/images
        $fileColumns = ['image', 'photo', 'avatar', 'thumbnail', 'document', 'file'];
        // Columns to exclude from form
        $excludeColumns = ['id', 'created_at', 'updated_at', 'is_active'];

        foreach ($columns as $column) {
            if (in_array($column, $excludeColumns)) continue;

            $type = Schema::getColumnType($tableName, $column);
            $fieldType = 'text'; // default

            // Map DB type to form field type
            switch ($type) {
                case 'text':
                    $fieldType = 'textarea';
                    break;
                case 'integer':
                case 'bigint':
                case 'smallint':
                case 'tinyint':
                    $fieldType = 'number';
                    break;
                case 'boolean':
                    $fieldType = 'checkbox'; // can be checkbox
                    break;
                case 'string':
                default:
                    $fieldType = 'text';
            }

            // Override for richtext columns
            if (Str::contains(Str::lower($column), ['content', 'description', 'body'])) {
                $fieldType = 'richtext';
            }

            // Override for file/image columns
            foreach ($fileColumns as $fileColumn) {
                if (Str::endsWith(Str::lower($column), Str::lower($fileColumn)) || Str::contains(Str::lower($column), Str::lower($fileColumn))) {
                    $fieldType = 'file';
                    break;
                }
            }

            $fields[] = [
                'name' => $column,
                'label' => Str::title(str_replace('_', ' ', $column)),
                'type' => $fieldType,
                'required' => true,
                'placeholder' => 'Enter ' . Str::title(str_replace('_', ' ', $column)),
            ];
        }

        return response()->json(['fields' => $fields]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors'  => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
    public function createCustomPost(Request $request, $tableName)
    {
        try {
            // 🔐 Auth check
            $user = Auth::user();
            if (!$user) {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
            }

            // ✅ Check if table exists
            if (!Schema::hasTable($tableName)) {
                return response()->json(['success' => false, 'message' => 'Table not found'], 404);
            }

            // 📋 Get all columns from table
            $columns = Schema::getColumnListing($tableName);
            $data = [];

            // 🛠 Prepare insert data
            foreach ($columns as $column) {
                // Skip auto/controlled fields
                if (in_array($column, ['id', 'created_at', 'updated_at'])) {
                    continue;
                }

                // 📁 Handle file uploads
                if ($request->hasFile($column)) {
                    $file = $request->file($column);
                    $folder = 'uploads/' . strtolower($tableName) . '/' . strtolower($column);
                    $fileName = time() . '_' . $file->getClientOriginalName();

                    // Move file to public directory
                    $file->move(public_path($folder), $fileName);

                    $data[$column] = $folder . '/' . $fileName;
                }
                // 📝 Handle regular input
                elseif ($request->has($column)) {
                    $data[$column] = $request->input($column);
                }
            }

            if (in_array('is_active', $columns) && !isset($data['is_active'])) {
                $data['is_active'] = 1;
            }

        
            if (in_array('created_at', $columns)) {
                $data['created_at'] = now();
            }
            if (in_array('updated_at', $columns)) {
                $data['updated_at'] = now();
            }
            DB::table($tableName)->insert($data);

            return response()->json([
                'success' => true,
                'message' => 'Post created successfully!',
            ], 200);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            // 🧯 Catch all other errors
            return response()->json([
                'success' => false,
                'message' => 'An error occurred.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function listCustomPosts($tableName)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
            }

            if (!Schema::hasTable($tableName)) {
                return response()->json(['error' => 'Table not found'], 404);
            }

            // Fetch all posts
            $customPosts = DB::table($tableName)
                ->orderBy('id', 'desc')
                ->get();

            // Columns to exclude from the response
            $excludeColumns = ['updated_at'];

            // Map each post to exclude the unwanted columns
            $filteredPosts = $customPosts->map(function ($post) use ($excludeColumns) {
                return collect($post)->except($excludeColumns)->toArray();
            });

            return response()->json([
                'success' => true,
                'data' => $filteredPosts,
                'message' => 'Post list successfully!'
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
    public function getCustomPostDetails($tableName, $id)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
            }
            if (!Schema::hasTable($tableName)) {
                return response()->json(['success' => false, 'message' => 'Table not found'], 404);
            }

            $post = DB::table($tableName)->where('id', $id)->first();

            if (!$post) {
                return response()->json(['success' => false, 'message' => 'Post not found'], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $post
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function updateCustomPost(Request $request, $tableName, $id)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
            }

            if (!Schema::hasTable($tableName)) {
                return response()->json(['success' => false, 'message' => 'Table not found'], 404);
            }

            $columns = Schema::getColumnListing($tableName);
            $existing = DB::table($tableName)->where('id', $id)->first();

            if (!$existing) {
                return response()->json(['success' => false, 'message' => 'Post not found'], 404);
            }

            $data = [];

            foreach ($columns as $column) {
                if (in_array($column, ['id', 'created_at', 'updated_at'])) {
                    continue;
                }

                if ($request->hasFile($column)) {
                    $file = $request->file($column);
                    $folder = 'uploads/' . strtolower($tableName) . '/' . strtolower($column);
                    $fileName = time() . '_' . $file->getClientOriginalName();
                    $file->move(public_path($folder), $fileName);

                    $data[$column] = $folder . '/' . $fileName;
                } elseif ($request->has($column)) {
                    $data[$column] = $request->input($column);
                }
            }

            // Update timestamp if column exists
            if (in_array('updated_at', $columns)) {
                $data['updated_at'] = now();
            }

            DB::table($tableName)->where('id', $id)->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Post updated successfully!',
            ], 200);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function deleteCustomPost(Request $request, $tableName, $id)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
            }

            // Check if table exists
            if (!Schema::hasTable($tableName)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Table not found'
                ], 404);
            }

            // Check if record exists
            $existing = DB::table($tableName)->where('id', $id)->first();
            if (!$existing) {
                return response()->json([
                    'success' => false,
                    'message' => 'Post not found'
                ], 404);
            }

            // Delete record
            DB::table($tableName)->where('id', $id)->delete();

            return response()->json([
                'success' => true,
                'message' => 'Post deleted successfully!'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while deleting the post.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

}