<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Services\V1\API\APIService;
use App\Services\V1\ServiceService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ServiceController extends Controller
{
    public function __construct(
        protected ServiceService $serviceService,
        protected APIService $apiservice
    ) {
    }

    public function getAll(){
        $services = $this->serviceService->getAll();

        return $this->apiservice->sendSuccess("Get all services", compact('services'));
    }

    public function createService(Request $request){
        $data = $request->validate([
            'service_name' => 'required|string|max:255',
            'price' => 'required|integer',
            'stock' => 'nullable|integer',
            'description' => 'nullable|string|max:255',
            'images' => 'required|array',
            'images.*' => 'required|image|mimes:jpg,jpeg,png,gif|max:2048'
        ]);

        if(isset($data['images']) && count($data['images']) > 5){
            return $this->apiservice->sendError('Gambar tidak boleh lebih dari 5.');
        }

        DB::beginTransaction();
        try {
            $service = $this->serviceService->createService($data);

            DB::commit();

            return $this->apiservice->sendSuccess('Jasa berhasil ditambahkan', compact('service'));
        } catch (\Exception $error){
            DB::rollBack();

            Log::alert($error->getMessage());

            return $this->apiservice->sendError("Gagal menambahkan jasa.");
        }
    }
}
