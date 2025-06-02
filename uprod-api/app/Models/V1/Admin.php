<?php

namespace App\Models\V1;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\V1\User; // Pastikan namespace User model sudah benar

class Admin extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'nik',
        'no_ktp',
        'full_name',
        'place_of_birth',
        'date_of_birth',
        'gender',
        'address',
        'phone_number',
        // Tambahkan atribut lain yang bisa diisi massal jika ada
    ];

    /**
     * Get the user that owns the admin profile.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'date_of_birth' => 'date', // Otomatis cast ke objek Carbon/Date
    ];
}