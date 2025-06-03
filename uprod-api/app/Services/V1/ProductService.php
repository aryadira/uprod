<?php

namespace App\Services\V1;

use App\Repositories\V1\ProductRepository;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\V1\Major;
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

    public function createProduct(array $data)
    {
        $currentUser = Auth::user();
        $currentMajor = Major::where('admin_id', $currentUser->id)->first();

        $data['major_id'] = $currentMajor->id;
        $data['code'] = 'PRD.' . Carbon::now()->format('Ym') . rand(100000, 999999);
        $data['slug'] = Str::slug($data['name']);

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
}