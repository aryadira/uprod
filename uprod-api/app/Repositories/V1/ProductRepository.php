<?php

namespace App\Repositories\V1;

use App\Models\V1\Product;
use App\Models\V1\ProductImage;
use Illuminate\Support\Collection;

class ProductRepository
{

    public function __construct(
        protected Product $product,
        protected ProductImage $productImage
    ) {
    }

    public function getAll(): Collection
    {
        $columns = ['id', 'product_code', 'product_name', 'price', 'availability', 'is_active', 'created_at'];
        $relations = ['productImages:id,product_id,image_path,image_order'];

        $products = $this->product
            ->select($columns)
            ->with($relations)->get();

        return collect($products);
    }

    public function getById(string $id): Product
    {
        return $this->product->find($id);
    }

    public function createProduct(array $data): Product
    {
        return $this->product->create($data);
    }

    public function updateProduct(string $id, array $data): Product
    {
        $product = $this->product->find($id);

        $product->update($data);

        return $product;
    }

    public function deleteProduct(string $id): bool|null
    {
        $product = $this->product->find($id);

        return (bool) $product?->delete();
    }

    public function getProductImage(string $productId)
    {
        return $this->productImage->where('product_id', $productId)->get();
    }

    public function uploadProductImage(string $productId, array $image)
    {
        $product = $this->product->find($productId);

        $productImage = $this->productImage->create([
            'product_id' => $product->id,
            'image_path' => $image['image_path'],
            'image_order' => $image['image_order']
        ]);

        return $productImage;
    }

    public function deleteProductImage(string $id): bool|null
    {
        $productImage = $this->getProductImage($id);

        return (bool) $productImage?->delete();
    }
}
