<?php

namespace App\Services\V1;

use App\Models\V1\Major;
use App\Repositories\V1\MajorRepository;
use Illuminate\Support\Str;

class MajorService
{
    public function __construct(
        protected MajorRepository $majorRepository)
    {
    }

    public function getAll() 
    {
        return $this->majorRepository->getAll();
    }

    public function getBySlug($slug) {
        return $this->majorRepository->getById($slug);
    }

    public function getByLimit(int $limit = 10)
    {
        return $this->majorRepository->getByLimit($limit);
    }

    public function createMajor(array $data): Major
    {
        $data['slug'] = Str::slug($data['name'], '_'); // => "information_systems"

        $data['acronim'] = collect(explode(' ', $data['name']))
            ->filter(fn($word) => ctype_upper($word[0]))
            ->map(fn($word) => strtoupper(substr($word, 0, 1)))
            ->join('');

        return $this->majorRepository->createMajor($data);
    }
}