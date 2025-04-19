<?php

namespace App\Repositories\V1;

use App\Models\V1\Major;

class MajorRepository
{
    public function __construct(protected Major $major)
    {
    }

    public function getAll()
    {
        return $this->major->all();
    }

    public function getByLimit(int $limit)
    {
        return $this->major->limit($limit)->get();
    }

    public function createMajor(array $data): Major
    {
        return $this->major->create($data);
    }
}
