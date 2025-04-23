<?php

namespace App\Models\V1;

use Illuminate\Database\Eloquent\Model;

class Major extends Model
{
    protected $table = 'majors';

    protected $fillable = [
        'admin_id',
        'created_by',
        'slug',
        'code',
        'logo_path',
        'banner_path',
        'name',
        'acronim',
        'description',
        'is_active'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'admin_id', 'id');
    }

    public function product()
    {
        return $this->hasMany(Product::class, 'major_id', 'id');
    }
}
