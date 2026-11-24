<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class StaffUserSeeder extends Seeder
{
    public function run(): void
    {
        $staff = [
            ['name' => 'Bekko Admin', 'email' => 'admin@bekkocoffee.test', 'role' => 'admin'],
            ['name' => 'Waiter', 'email' => 'waiter@bekkocoffee.test', 'role' => 'waiter'],
            ['name' => 'Kitchen', 'email' => 'kitchen@bekkocoffee.test', 'role' => 'kitchen'],
        ];

        foreach ($staff as $person) {
            User::query()->updateOrCreate(
                ['email' => $person['email']],
                [...$person, 'password' => 'password'],
            );
        }
    }
}
