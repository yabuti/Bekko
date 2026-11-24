<?php

namespace Database\Seeders;

use App\Models\MenuItem;
use Illuminate\Database\Seeder;
use JsonException;

class MenuItemSeeder extends Seeder
{
    /**
     * @throws JsonException
     */
    public function run(): void
    {
        $data = json_decode(
            file_get_contents(resource_path('js/data/menu.json')),
            true,
            512,
            JSON_THROW_ON_ERROR,
        );

        foreach ($data['items'] as $item) {
            MenuItem::query()->updateOrCreate(
                [
                    'category' => $item['category'],
                    'group_label' => $item['group_label'],
                    'name' => $item['name'],
                ],
                [
                    'category_label' => $item['category_label'],
                    'price' => $item['price'],
                    'image' => $item['image'],
                    'sort_order' => $item['sort_order'],
                ],
            );
        }
    }
}
