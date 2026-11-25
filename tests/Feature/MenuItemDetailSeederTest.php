<?php

namespace Tests\Feature;

use App\Models\MenuItem;
use Database\Seeders\MenuItemDetailSeeder;
use Database\Seeders\MenuItemSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MenuItemDetailSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_seeder_populates_details_for_all_seeded_meals(): void
    {
        $this->seed(MenuItemSeeder::class);
        $this->seed(MenuItemDetailSeeder::class);

        $this->assertSame(142, MenuItem::query()->count());
        $this->assertSame(142, MenuItem::query()
            ->whereNotNull('description')
            ->whereNotNull('ingredients')
            ->count());

        $coffee = MenuItem::query()->where('name', 'Traditional Coffee')->firstOrFail();
        $this->assertSame('Freshly brewed Ethiopian coffee, served black in a small cup.', $coffee->description);
        $this->assertSame('Roasted coffee beans, Water', $coffee->ingredients);
    }

    public function test_seeder_fills_missing_details_without_overwriting_admin_edits(): void
    {
        MenuItem::factory()->create([
            'name' => 'Egg Sandwich',
            'description' => 'Description written by the admin.',
            'ingredients' => null,
        ]);

        $this->seed(MenuItemDetailSeeder::class);

        $item = MenuItem::query()->where('name', 'Egg Sandwich')->firstOrFail();
        $this->assertSame('Description written by the admin.', $item->description);
        $this->assertSame('Bread, Egg, Butter, Salt, Pepper', $item->ingredients);
    }
}
