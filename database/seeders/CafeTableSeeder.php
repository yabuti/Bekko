<?php

namespace Database\Seeders;

use App\Models\CafeTable;
use Illuminate\Database\Seeder;

class CafeTableSeeder extends Seeder
{
    public function run(): void
    {
        foreach (range(1, 10) as $number) {
            CafeTable::query()->updateOrCreate(
                ['code' => 'T'.$number],
                ['name' => 'Table '.$number],
            );
        }
    }
}
