<?php

namespace App\Http\Controllers\V1;

use App\Http\Controllers\Controller;
use App\Services\V1\MajorService;
use App\Services\V1\API\APIService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MajorController extends Controller
{
    public function __construct(
        protected MajorService $majorService,
        protected APIService $apiService,
    ) {
    }
    public function getAll(): JsonResponse
    {
        $majors = $this->majorService->getAll();

        return $this->apiService->sendSuccess('Get major data', compact('majors'));
    }

    public function getBySlug($slug)
    {
        $major = $this->majorService->getBySlug($slug);

        return $this->apiService->sendSuccess('Get single major', compact('major'));
    }

    public function createMajor(Request $request)
    {
        $validated = $request->validate([
            'admin_id' => ['required'],
            'logo_path' => ['required', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],
            'banner_path' => ['required', 'image', 'mimes:jpg,jpeg,png', 'max:4096'],
            'name' => ['required', 'string', 'max:100', 'unique:majors,name'],
            'description' => ['nullable', 'string', 'max:1000'],
        ]);

        if ($request->hasFile('logo_path') && $request->file('logo_path')->isValid()) {
            $logoName = time() . '_logo_' . $request->file('logo_path')->getClientOriginalName();
            $request->file('logo_path')->move(public_path('uploads/major/logo'), $logoName);
            $validated['logo_path'] = 'uploads/major/logo/' . $logoName;
        }

        if ($request->hasFile('banner_path') && $request->file('banner_path')->isValid()) {
            $bannerName = time() . '_banner_' . $request->file('banner_path')->getClientOriginalName();
            $request->file('banner_path')->move(public_path('uploads/major/banner'), $bannerName);
            $validated['banner_path'] = 'uploads/major/banner/' . $bannerName;
        }

        $newMajor = $this->majorService->createMajor($validated);

        return $this->apiService->sendSuccess('Major created successfully!', compact('newMajor'));
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