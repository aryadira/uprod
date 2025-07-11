<?php

namespace App\Repositories\V1;

use App\Models\V1\Major;
use Illuminate\Support\Collection;

class MajorRepository
{
    public function __construct(protected Major $major)
    {
    }

    public function getAll(): Collection
    {
        return collect($this->major->all());
    }

    public function getById(string $slug)
    {
        return $this->major
            ->where('slug', $slug)->with(['user:id,name,email']) // hanya ambil id dan name dari tabel users
            ->whereRelation('user', 'user_role_id', 2)
            ->get();
        ;
    }

    public function getMajorAdmin()
    {
        return $this->major
            ->query()
            ->with('user')
            ->whereHas('user', fn($q) => $q->where('user_role_id', 2))->get();
    }

    public function getByLimit(int $limit)
    {
        return $this->major
            ->query()
            ->with(['user:id,name,email']) // hanya ambil id dan name dari tabel users
            ->whereRelation('user', 'user_role_id', 2)
            ->limit($limit)
            ->get();
    }

    public function createMajor(array $data): Major
    {
        return $this->major->create($data);
    }
}