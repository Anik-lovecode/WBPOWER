<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use App\Models\Menu;
use App\Http\Resources\MenuResource;
use Illuminate\Support\Facades\Log;
use Exception;

class MenuController extends Controller
{
    public function menuUpdate(Request $request, $id)
    {
        $menu = Menu::find($id);

        if (!$menu) {
            return response()->json([
                'status' => false,
                'message' => 'Menu not found'
            ], 404);
        }

        $validated = $request->validate([
            'title'     => 'required|string',
            'url'       => 'required|string',
            'parent_id' => 'nullable|integer|exists:menus,id',
            'order'     => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        $menu->update([
            'title'     => $validated['title'],
            'url'       => $validated['url'],
            'parent_id' => $validated['parent_id'] ?? null,
            'order'     => $validated['order'] ?? $menu->order,
            'is_active' => $validated['is_active'] ?? $menu->is_active,
        ]);

        return response()->json([
            'status'  => true,
            'message' => 'Menu updated successfully',
            'data'    => new MenuResource($menu->fresh()),
        ]);
    }

    public function menuCreate(Request $request)
    {
        // Safe logging: context must be array
       

        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 401);
            }

            $validated = $request->validate([
                'title'     => 'required|string|max:255',
                'url'       => 'required|string|max:255',
                'parent_id' => 'nullable|exists:menus,id',
                'order'     => 'nullable|integer',
                'is_active' => 'nullable|boolean',
            ]);

            $menu = Menu::create([
                'title'     => $validated['title'],
                'url'       => $validated['url'],
                'parent_id' => $validated['parent_id'] ?? null,
                'order'     => $validated['order'] ?? 0,
                'is_active' => $validated['is_active'] ?? true,
            ]);

            return response()->json([
                'message' => 'Menu created successfully',
                'data'    => new MenuResource($menu),
            ], 201);

        } catch (ValidationException $e) {
            Log::error('menuCreate validation failed', [
                'errors' => $e->errors(),
                'user_id' => optional(Auth::user())->id,
            ]);

            return response()->json([
                'success' => false,
                'errors'  => $e->errors()
            ], 422);
        } catch (Exception $e) {
            Log::error('menuCreate exception', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Something went wrong'
            ], 500);
        }
    }

    public function menuList(Request $request)
    {
        try {
            // Public-facing menu list — no auth required. Return top-level menus and
            // nested children that are active.
            $menus = Menu::whereNull('parent_id')
                ->where('is_active', true)
                ->orderBy('order', 'asc')
                ->with('childrenRecursive')
                ->get();

            return MenuResource::collection($menus);

        } catch (ValidationException $e) {
            Log::error('menuList validation failed', [
                'errors' => $e->errors(),
            ]);

            return response()->json([
                'success' => false,
                'errors'  => $e->errors()
            ], 422);
        } catch (Exception $e) {
            Log::error('menuList exception', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Something went wrong'
            ], 500);
        }
    }

    public function deleteMenu(Request $request, $menu_id)
    {
        try {
            $user = Auth::user();

            Log::info('deleteMenu called', [
                'menu_id' => $menu_id,
                'user_id' => optional($user)->id,
            ]);

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 401);
            }

            $menu = Menu::find($menu_id);

            if (!$menu) {
                return response()->json(['message' => 'Menu not found'], 404);
            }

            $menu->delete();

            return response()->json([
                'success' => true,
                'message' => 'Menu deleted successfully!'
            ]);
        } catch (ValidationException $e) {
            Log::error('deleteMenu validation failed', [
                'errors' => $e->errors(),
            ]);

            return response()->json([
                'success' => false,
                'errors'  => $e->errors()
            ], 422);
        } catch (Exception $e) {
            Log::error('deleteMenu exception', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Something went wrong'
            ], 500);
        }
    }
}
