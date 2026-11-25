<?php

namespace Database\Seeders;

use App\Models\MenuItem;
use Illuminate\Database\Seeder;
use JsonException;

class MenuItemDetailSeeder extends Seeder
{
    /**
     * Fill in starter description and ingredient text for seeded meals.
     * Only empty fields are filled, so admin edits are preserved.
     *
     * @throws JsonException
     */
    public function run(): void
    {
        $details = json_decode(
            file_get_contents(resource_path('js/data/menuDetails.json')),
            true,
            512,
            JSON_THROW_ON_ERROR,
        );

        $timestamp = now();

        $rows = MenuItem::query()
            ->whereIn('name', array_keys($details))
            ->get([
                'id', 'category', 'category_label', 'group_label', 'name',
                'description', 'ingredients', 'price', 'image', 'sort_order', 'created_at',
            ])
            ->map(fn (MenuItem $item): array => [
                'id' => $item->id,
                'category' => $item->category,
                'category_label' => $item->category_label,
                'group_label' => $item->group_label,
                'name' => $item->name,
                'description' => $item->description ?: $details[$item->name]['description'],
                'ingredients' => $item->ingredients ?: $details[$item->name]['ingredients'],
                'price' => $item->price,
                'image' => $item->image,
                'sort_order' => $item->sort_order,
                'created_at' => $item->created_at,
                'updated_at' => $timestamp,
            ])
            ->all();

        if ($rows !== []) {
            MenuItem::query()->upsert($rows, ['id'], ['description', 'ingredients', 'updated_at']);
        }
    }
}
