<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Http\Requests\SaveMenuItemRequest;
use App\Models\MenuItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class MenuController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Staff/Menu', [
            'categories' => $this->categories(),
            'items' => MenuItem::query()
                ->orderBy('sort_order')
                ->orderBy('id')
                ->get(['id', 'category', 'category_label', 'group_label', 'name', 'price', 'image', 'sort_order']),
        ]);
    }

    public function store(SaveMenuItemRequest $request): RedirectResponse
    {
        $data = $request->safe()->only(['name', 'category', 'group_label', 'price', 'sort_order']);
        $data['category_label'] = $this->categoryLabel($data['category']);
        $data['sort_order'] ??= (int) MenuItem::max('sort_order') + 1;
        $data['image'] = $request->hasFile('image')
            ? $this->storePhoto($request->file('image'))
            : $this->fallbackImage($data['category']);

        MenuItem::create($data);

        return back()->with('success', 'staffMenu.flash.created');
    }

    public function update(SaveMenuItemRequest $request, MenuItem $menuItem): RedirectResponse
    {
        $data = $request->safe()->only(['name', 'category', 'group_label', 'price', 'sort_order']);
        $data['category_label'] = $this->categoryLabel($data['category']);

        if ($request->hasFile('image')) {
            $this->deletePhoto($menuItem->image);
            $data['image'] = $this->storePhoto($request->file('image'));
        } elseif ($request->boolean('remove_photo')) {
            $this->deletePhoto($menuItem->image);
            $data['image'] = $this->fallbackImage($data['category']);
        }

        $menuItem->update($data);

        return back()->with('success', 'staffMenu.flash.updated');
    }

    public function destroy(MenuItem $menuItem): RedirectResponse
    {
        $this->deletePhoto($menuItem->image);
        // Soft delete keeps historical order lines intact.
        $menuItem->delete();

        return back()->with('success', 'staffMenu.flash.deleted');
    }

    /**
     * @return array<int, array<string, string>>
     */
    private function categories(): array
    {
        $data = json_decode(
            file_get_contents(resource_path('js/data/menu.json')),
            true,
            512,
            JSON_THROW_ON_ERROR,
        );

        return array_map(
            fn (array $category) => [
                'id' => $category['id'],
                'label' => $category['label'],
                'blurb' => $category['blurb'],
            ],
            $data['categories'],
        );
    }

    private function categoryLabel(string $category): string
    {
        foreach ($this->categories() as $option) {
            if ($option['id'] === $category) {
                return $option['label'];
            }
        }

        return Str::headline($category);
    }

    private function storePhoto(UploadedFile $file): string
    {
        return '/menu-photos/'.$file->store('/', 'menu_photos');
    }

    private function deletePhoto(?string $image): void
    {
        if ($image && Str::startsWith($image, '/menu-photos/')) {
            Storage::disk('menu_photos')->delete(Str::after($image, '/menu-photos/'));
        }
    }

    private function fallbackImage(string $category): string
    {
        return match ($category) {
            'breakfast' => '/images/breakfast.svg',
            'lunch' => '/images/lunch.svg',
            'bites' => '/images/burger.svg',
            'drinks' => '/images/coffee.svg',
            'fresh' => '/images/juice.svg',
            default => '/images/lunch.svg',
        };
    }
}
