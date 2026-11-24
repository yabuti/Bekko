<?php

namespace App\Http\Controllers;

use App\Models\MenuItem;
use Inertia\Inertia;
use Inertia\Response;
use JsonException;

class HomeController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Home');
    }

    /**
     * @throws JsonException
     */
    public function menu(): Response
    {
        $data = json_decode(
            file_get_contents(resource_path('js/data/menu.json')),
            true,
            512,
            JSON_THROW_ON_ERROR,
        );

        return Inertia::render('Menu', [
            'categories' => array_map(
                fn (array $category) => [
                    'id' => $category['id'],
                    'label' => $category['label'],
                    'blurb' => $category['blurb'],
                ],
                $data['categories'],
            ),
            'items' => MenuItem::query()
                ->orderBy('sort_order')
                ->get(['id', 'category', 'group_label', 'name', 'price', 'image']),
        ]);
    }
}
