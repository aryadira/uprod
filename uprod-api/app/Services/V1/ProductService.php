<?php

namespace App\Services\V1;

use App\Repositories\V1\ProductRepository;
use Illuminate\Support\Facades\Auth;
use App\Models\V1\Major;
use App\Models\V1\Product;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class ProductService
{
    public function __construct(
        protected ProductRepository $productRepository,
    ) {
    }

    public function getAll()
    {
        $products = $this->productRepository->getAll();

        return $products;
    }

    public function getById(string $id): Product|null
    {
        $product = $this->productRepository->getById($id);

        if (!$product) {
            return null;
        }

        return $product;
    }

    public function createProduct(array $data)
    {
        $currentUser = Auth::user();
        $currentMajor = Major::where('admin_id', $currentUser->id)->first();
        $data['major_id'] = $currentMajor->id;
        $data['product_code'] = 'PRD.' . Carbon::now()->format('Ym') . '.' . random_int(100000, 999999);
        $data['slug'] = Str::slug($data['product_name']);
        $data['availability'] = $this->availabilityClassification($data['stock']);

        $product = $this->productRepository->createProduct($data);

        $uploadedImages = [];
        foreach ($data['images'] ?? [] as $idx => $image) {
            $filename = Carbon::now()->format('Ymd') . Str::random(10) . $image->getClientOriginalName();
            $image->move(public_path('uploads/products'), $filename);
            $imageData = [
                'image_path' => $filename,
                'image_order' => $idx + 1,
            ];
            $uploadedImages[] = $this->productRepository->uploadProductImage($product->id, $imageData);
        }
        $data['images'] = $uploadedImages;
        return $data;
    }

    private function availabilityClassification($stock)
    {
        return $stock == 0 ? 'out_of_stock' : ($stock > 10 ? "available" : "low_stock");
    }

    public function uploadProductImage($productId, $image)
    {
        return $this->productRepository->uploadProductImage($productId, $image);
    }

    public function updateProduct(string $id, array $data): Product|null
    {
        $updatedProduct = $this->productRepository->updateProduct($id, $data);

        $uploadedImages = $data['images'] ?? [];

        if ($uploadedImages) {
            foreach ($uploadedImages as $image) {
                $imageName = Carbon::now()->format('Ymd') . Str::random(10) . $image->getClientOriginalName();
                $image->move(public_path('uploads/products'), $imageName);

                $this->productRepository->uploadProductImage($id, $image);
            }
        }

        if (!$updatedProduct) {
            return null;
        }

        return $updatedProduct;
    }

    public function deleteProduct(string $id): bool|null
    {
        $deletedProduct = $this->productRepository->deleteProduct($id);

        if (!$deletedProduct) {
            return null;
        }

        return $deletedProduct;
    }
}
