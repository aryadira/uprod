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

        $validated['logo_path'] = $this->uploadImage($request, 'logo_path', 'major/logo');
        $validated['banner_path'] = $this->uploadImage($request, 'banner_path', 'major/banner');

        $newMajor = $this->majorService->createMajor($validated);

        return $this->apiService->sendSuccess('Major created successfully!', compact('newMajor'));
    }

    private function uploadImage(Request $request, string $field, string $destinationPath)
    {
        if ($request->hasFile($field) && $request->file($field)->isValid()) {
            $file = $request->file($field);
            $name = time() . '_' . $field . '_' . $file->getClientOriginalName();
            $file->move(public_path('/uploads/' . $destinationPath), $name);
            return $destinationPath . '/' . $name;
        }

        return null;
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
