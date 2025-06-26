<?php

namespace App\Repositories\V1;

use App\Models\V1\Service;
use App\Models\V1\ServiceImage;
use Illuminate\Support\Collection;

class ServiceRepository
{

    public function __construct(
        protected Service $service,
        protected ServiceImage $serviceImage
    ) {
    }

    public function getAll(): Collection
    {
        $columns = ['id', 'service_code', 'service_name', 'price', 'availability', 'is_active', 'created_at'];
        $relations = ['serviceImages:id,service_id,image_path,image_order'];

        $services = $this->service
            ->select($columns)
            ->with($relations)->get();

        return collect($services);
    }

    public function getById(string $id): Service
    {
        return $this->service->find($id);
    }

    public function createService(array $data): Service
    {
        return $this->service->create($data);
    }

    public function updateService(string $id, array $data): Service
    {
        $service = $this->service->find($id);

        $service->update($data);

        return $service;
    }

    public function deleteService(string $id): bool|null
    {
        $service = $this->service->find($id);

        return (bool) $service?->delete();
    }

    public function getServiceImage(string $serviceId)
    {
        return $this->serviceImage->where('service_id', $serviceId)->get();
    }

    public function uploadServiceImage(string $serviceId, array $image)
    {
        $service = $this->service->find($serviceId);

        $serviceImage = $this->serviceImage->create([
            'service_id' => $service->id,
            'image_path' => $image['image_path'],
            'image_order' => $image['image_order']
        ]);

        return $serviceImage;
    }

    public function deleteServiceImage(string $id): bool|null
    {
        $serviceImage = $this->getServiceImage($id);

        return (bool) $serviceImage?->delete();
    }
}
