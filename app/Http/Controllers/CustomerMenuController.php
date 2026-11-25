<?php

namespace App\Http\Controllers;

use App\Http\Requests\FindTableRequest;
use App\Models\CafeTable;
use App\Models\MenuItem;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use JsonException;

class CustomerMenuController extends Controller
{
    public function findTable(FindTableRequest $request): RedirectResponse
    {
        return redirect()->route('tables.menu', $request->validated()['table_number']);
    }

    /**
     * @throws JsonException
     */
    public function show(CafeTable $cafeTable): Response
    {
        $data = json_decode(
            file_get_contents(resource_path('js/data/menu.json')),
            true,
            512,
            JSON_THROW_ON_ERROR,
        );

        return Inertia::render('CustomerMenu', [
            'table' => [
                'id' => $cafeTable->id,
                'code' => $cafeTable->code,
                'name' => $cafeTable->name,
            ],
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
                ->get(['id', 'category', 'group_label', 'name', 'description', 'ingredients', 'price', 'image']),
        ]);
    }
}
