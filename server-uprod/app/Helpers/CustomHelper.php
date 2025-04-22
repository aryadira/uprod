<?php

namespace App\Helpers;

use Illuminate\Support\Facades\DB;

if (!function_exists('generate_code')) {
    function generateCode(string $prefix, string $modelClass, string $column = 'code'): string
    {
        $year = date('Y');
        $last = DB::table((new $modelClass)->getTable())
            ->where($column, 'like', $prefix . $year . '%')
            ->orderBy($column, 'desc')
            ->first();

        if ($last) {
            $lastNumber = (int) substr($last->$column, -5);
            $newNumber = str_pad($lastNumber + 1, 5, '0', STR_PAD_LEFT);
        } else {
            $newNumber = '00001';
        }

        return $prefix + $year + $newNumber;
    }
}

if (!function_exists('generateAcronim')) {
    function generateAcronim(string $text): string
    {
        $words = explode(' ', strtoupper(trim($text)));

        $acronim = '';
        foreach ($words as $word) {
            if (!empty($word)) {
                $acronim .= $word[0];
            }
        }

        return $acronim;
    }
}

