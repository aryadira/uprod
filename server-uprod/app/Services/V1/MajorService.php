<?php

namespace App\Services\V1;

use App\Models\V1\Major;
use App\Repositories\V1\MajorRepository;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

use function App\Helpers\generate_code;
use function App\Helpers\generateAcronim;

class MajorService
{
    public function __construct(protected MajorRepository $majorRepository)
    {
    }

    public function getAll()
    {
        return $this->majorRepository->getAll();
    }

    public function getByLimit(int $limit = 10)
    {
        return $this->majorRepository->getByLimit($limit);
    }

    public function createMajor(array $data): Major
    {
        $currentUser = Auth::user();

        $data['created_by'] = $currentUser;
        $data['slug'] = Str::slug($data['name']);
        $data['name'] = ucwords($data['name']);
        $data['acronim'] = generateAcronim($data['name']);
        $data['code'] = generate_code($data['acronim'], Major::class, 'code');

        return $this->majorRepository->createMajor($data);
    }
}
