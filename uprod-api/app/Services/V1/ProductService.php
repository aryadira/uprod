<?php

namespace App\Services\V1;

use App\Repositories\V1\ProductRepository;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
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
        $data['code'] = 'PRD.' . Carbon::now()->format('Ym') . rand(100000, 999999);
        $data['slug'] = Str::slug($data['name']);
        $data['availability'] = ($data['stock'] == 0) ? 'out_of_stock' : (($data['stock'] >= 10) ? 'available' : 'low_stock');

        $product = $this->productRepository->createProduct($data);

        $uploadedImages = [];

        foreach ($data['images'] as $image) {
            $imageName = Carbon::now()->format('Ymd') . Str::random(10) . $image->getClientOriginalName();
            $image->move(public_path('uploads/products'), $imageName);
            $storedImage = $this->productRepository->uploadProductImage($imageName, $product->id);
            $uploadedImages[] = $storedImage;
        }

        $data['images'] = $uploadedImages;

        return $data;
    }

    public function uploadProductImage($image, $productId)
    {
        $productImage = $this->productRepository->uploadProductImage($image, $productId);

        return $productImage;
    }

    public function updateProduct(string $id, array $data): Product|null {
        $updatedProduct = $this->productRepository->updateProduct($id, $data);

        $uploadedImages = $data['images'] ?? []; 

        if($uploadedImages){
            foreach($uploadedImages as $image){
                $imageName = Carbon::now()->format('Ymd') . Str::random(10) . $image->getClientOriginalName();
                $image->move(public_path('uploads/products'), $imageName);

                $this->productRepository->uploadProductImage($imageName, $id);
            }
        }
        
        if(!$updatedProduct){
            return null;
        }

        return $updatedProduct;
    }

    public function deleteProduct(string $id): bool|null{
        $deletedProduct = $this->productRepository->deleteProduct($id);

        if(!$deletedProduct){
            return null;
        }

        return $deletedProduct;
    }
}