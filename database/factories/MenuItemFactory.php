<?php

namespace Database\Factories;

use App\Models\MenuItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MenuItem>
 */
class MenuItemFactory extends Factory
{
    protected $model = MenuItem::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'category' => 'lunch',
            'category_label' => 'Lunch',
            'group_label' => null,
            'name' => fake()->unique()->words(3, true),
            'price' => fake()->numberBetween(100, 1500),
            'image' => '/images/lunch.svg',
            'sort_order' => fake()->numberBetween(0, 1000),
        ];
    }
}
