<?php

namespace App\Http\Controllers\V1;

use App\Http\Controllers\Controller;
use App\Services\V1\ProductService;
use Illuminate\Http\Request;
use App\Services\V1\API\APIService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

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

            return $this->apiService->sendError("Gagal menambahkan produk" . $error->getMessage());
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}