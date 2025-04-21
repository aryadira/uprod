<?php

namespace App\Models\V1;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Customer extends Model
{
    protected $table = 'customers';

    protected $fillable = [
        'user_id',
        'fullname',
        'nik',
        'no_ktp',
        'email',
        'phone',
        'gender',
        'date_of_birth',
        'address'
    ];

    public function user(): HasOne
    {
        return $this->hasOne(User::class, 'user_id', 'id');
    }
}
