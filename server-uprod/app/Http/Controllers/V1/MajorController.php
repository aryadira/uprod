<?php

namespace App\Http\Controllers\V1;

use App\Http\Controllers\Controller;
use App\Services\V1\MajorService;
use Illuminate\Http\Request;

class MajorController extends Controller
{
    public function __construct(protected MajorService $majorService)
    {
    }

    public function getAll()
    {
        $majors = $this->majorService->getByLimit(10);

        return response()->json([
            'status' => 'success',
            'statusCode' => 200,
            'message' => 'Get all major data',
            'major' => $majors
        ]);
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
            $validated['logo_path'] = $request->file('logo_path')->store('uploads/major/logo', 'public');
        }

        if ($request->hasFile('banner_path') && $request->file('banner_path')->isValid()) {
            $bannerName = time() . '_banner_' . $request->file('banner_path')->getClientOriginalName();
            $validated['banner_path'] = $request->file('banner_path')->store('uploads/major/banner', 'public');
        }

        $newMajor = $this->majorService->createMajor($validated);

        return response()->json([
            'status' => 'success',
            'statusCode' => 200,
            'message' => 'Major created successfully!',
            'data' => $newMajor
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
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
