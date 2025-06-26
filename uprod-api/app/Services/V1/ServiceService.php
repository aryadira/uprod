<?php

namespace App\Services\V1;

use App\Models\V1\Major;
use App\Models\V1\Service;
use App\Repositories\V1\ServiceRepository;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class ServiceService
{
    public function __construct(
        protected ServiceRepository $serviceRepository
    ) {
    }

    public function getAll()
    {
        $services = $this->serviceRepository->getAll();

        return $services;
    }

    public function createService(array $data)
    {
        $currentUser = Auth::user();
        $currentMajor = Major::where('admin_id', $currentUser->id);
        $data['major_id'] = $currentMajor->id;
        $data['service_code'] = 'SRV.' . Carbon::now()->format('Ym') . '.' . rand(100000, 999999);
        $data['slug'] = Str::slug($data['service_name']);
        $data['availability'] = $this->availabilityClassification($data['stock']);

        $service = $this->serviceRepository->createService($data);

        $uploadImages = [];
        foreach ($data['images'] ?? [] as $idx => $image) {
            $filename = Carbon::now()->format('Ymd') . Str::random(10) . $image->getClientOriginalName();
            $image->move(public_path('uploads/services'), $filename);
            $imageData = [
                'image_path' => $filename,
                'image_order' => $idx + 1
            ];
            $uploadImages[] = $this->serviceRepository->uploadServiceImage($service->id, $imageData);
        }
        $data['images'] = $uploadImages;
        return $data;
    }

    private function availabilityClassification($stock)
    {
        return $stock == 0 ? "out_of_stock" : ($stock > 10 ? "available" : "low_stock");
    }

    public function uploadServiceImage($serviceId, $image)
    {
        return $this->serviceRepository->uploadServiceImage($serviceId, $image);
    }

    public function updateService(string $id, array $data): Service|null
    {
        $updatedService = $this->serviceRepository->updateService($id, $data);

        $uploadedImages = $data['images'] ?? [];

        if ($uploadedImages) {
            foreach ($uploadedImages as $image) {
                $imageName = Carbon::now()->format('Ymd') . Str::random(10) . $image->getClientOriginalName();
                $image->move(public_path('uploads/services'), $imageName);

                $this->serviceRepository->uploadServiceImage($id, $image);
            }
        }

        if (!$updatedService) {
            return null;
        }

        return $updatedService;
    }

    public function deleteService(string $id): bool|null
    {
        $deletedService = $this->serviceRepository->deleteService($id);

        if (!$deletedService) {
            return null;
        }

        return $deletedService;
    }
}


