<?php

namespace App\Models\V1;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $table = 'products';

    protected $fillable = [
        'major_id',
        'name',
        'slug',
        'code',
        'price',
        'stock',
        'description'
    ];

    public function major()
    {
        return $this->belongsTo(Major::class, 'major_id', 'id');
    }
}
