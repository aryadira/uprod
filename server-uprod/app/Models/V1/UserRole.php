<?php

namespace App\Models\V1;

use Illuminate\Database\Eloquent\Model;

class UserRole extends Model
{
    protected $table = 'user_roles';

    protected $fillable = [
        'role_name'
    ];

    public function users(){
        return $this->hasMany(User::class, 'user_role_id', 'id');
    }
}
