<?php

namespace Database\Seeders;

use App\Models\V1\Major;
use Illuminate\Support\Str;
use Illuminate\Database\Seeder;

class MajorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $majors = [
            [
                'admin_id' => 1,
                'slug' => Str::slug('Information Technology'),
                'logo_path' => 'images/majors/it-logo.png',
                'banner_path' => 'images/majors/it-banner.jpg',
                'major_name' => 'Information Technology',
                'major_acronim' => 'IT',
                'description' => 'The IT major focuses on the study of computing technologies and information systems.',
            ],
            [
                'admin_id' => 2,
                'slug' => Str::slug('Business Administration'),
                'logo_path' => 'images/majors/business-logo.png',
                'banner_path' => 'images/majors/business-banner.jpg',
                'major_name' => 'Business Administration',
                'major_acronim' => 'BA',
                'description' => 'Business Administration major teaches principles of business, management, and operations.',
            ],
            [
                'admin_id' => 1,
                'slug' => Str::slug('Mechanical Engineering'),
                'logo_path' => 'images/majors/mech-logo.png',
                'banner_path' => 'images/majors/mech-banner.jpg',
                'major_name' => 'Mechanical Engineering',
                'major_acronim' => 'ME',
                'description' => 'Mechanical Engineering major covers mechanical systems, design, and manufacturing.',
            ]
        ];

        foreach ($majors as $major) {
            Major::create($major);
        }
    }
}
