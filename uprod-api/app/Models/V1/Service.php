<?php

namespace App\Models\V1;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Service extends Model
{
    protected $table = 'services';

    protected $fillable = [
        'major_id',
        'service_code',
        'service_name',
        'slug',
        'price',
        'description',
        'availability',
        'is_active'
    ];

    public function major(): BelongsTo
    {
        return $this->belongsTo(Major::class, 'major_id', 'id');
    }

    public function serviceImage()
    {
        return $this->hasMany(ServiceImage::class, 'service_id', 'id');
    }
}
