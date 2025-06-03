<?php

namespace App\Http\Controllers\V1;

use App\Http\Controllers\Controller;
use App\Services\V1\ProductService;
use Illuminate\Http\Request;
use App\Services\V1\API\APIService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    public function __construct(
        protected ProductService $productService,
        protected APIService $apiService
    ) {
    }

    public function getAll(): JsonResponse
    {
        $products = $this->productService->getAll();

        return $this->apiService->sendSuccess('Get all products', compact('products'));
    }

    public function createProduct(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|integer',
            'stock' => 'nullable|integer',
            'description' => 'nullable|string|max:255',
            'images' => 'required|array',
            'images.*' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        DB::beginTransaction();
        try {
            if ($request->hasFile('images')) {
                $product = $this->productService->createProduct($data);
            }

            DB::commit();

            return $this->apiService->sendSuccess('Produk berhasil ditambahkan', compact('product'));

        } catch (\Exception $error) {
            DB::rollBack();

            Log::alert($error->getMessage());

            return $this->apiService->sendError("Gagal menambahkan produk");
        }
    }
    public function productDetails(string $id): JsonResponse
    {
        $product = $this->productService->getById($id);

        if (!$product) {
            return $this->apiService->sendNotFound("Produk tidak ditemukan");
        }

        return $this->apiService->sendSuccess('Get ' . $product->name, compact('product'));
    }

    public function updateProduct(Request $request, string $id)
    {
        $data = $request->validate([
            'name' => 'string|max:255',
            'price' => 'integer',
            'stock' => 'nullable|integer',
            'description' => 'nullable|string|max:255',
            'images' => 'array|max:5',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        DB::beginTransaction();
        try {
            $product = $this->productService->updateProduct($id, $data);

            DB::commit();

            return $this->apiService->sendSuccess('Produk berhasil diubah', compact('product'));
        } catch (\Exception $error) {
            DB::rollBack();

            Log::alert($error->getMessage());

            return $this->apiService->sendError("Gagal mengubah produk");
        }
    }

    public function deleteProduct(string $id)
    {   
        $deletedProduct =  $this->productService->deleteProduct($id);

        if (!$deletedProduct) {
            return $this->apiService->sendNotFound("Produk tidak ditemukan");
        }

        return $this->apiService->sendSuccess('Produk berhasil dihapus');
    }
}