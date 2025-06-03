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
        return collect($this->product->all());
    }

    public function getById(string $id): Product|null
    {
        return $this->product->find($id);
    }

    public function createProduct(array $data): Product
    {
        return $this->product->create($data);
    }

    public function uploadProductImage(string $image, string $id)
    {
        $product = $this->product->findOrFail($id);
        
        $productImage = $this->productImage->create([
            'product_id' => $product->id,
            'image_path' => $image
        ]);

        return $productImage;
    }

    public function updateProduct(array $data, string $id): Product|null
    {
        $product = $this->product->findOrFail($id);

        if (!$product) {
            return null;
        }

        $product->update($data);

        return $product;
    }

    public function deleteProduct(string $id): bool|null
    {
        $product = $this->product->findOrFail($id);

        if (!$product) {
            return null;
        }

        return (bool) $product->delete();
    }
}