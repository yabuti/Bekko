<?php

namespace App\Http\Requests;

use App\Models\MenuItem;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SaveMenuItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'admin';
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $item = $this->route('menu_item');

        $nameRule = Rule::unique('menu_items', 'name')->whereNull('deleted_at');

        if ($item instanceof MenuItem) {
            $nameRule->ignore($item->id);
        }

        return [
            'name' => ['required', 'string', 'max:255', $nameRule],
            'category' => ['required', Rule::in(config('site.menu_categories'))],
            'group_label' => ['nullable', 'string', 'max:255'],
            'price' => ['required', 'integer', 'min:0', 'max:1000000'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:100000'],
            'image' => ['nullable', 'file', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'remove_photo' => ['sometimes', 'boolean'],
        ];
    }
}
