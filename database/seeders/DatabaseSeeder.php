<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            CafeTableSeeder::class,
            StaffUserSeeder::class,
            MenuItemSeeder::class,
            MenuItemDetailSeeder::class,
        ]);
    }
}
