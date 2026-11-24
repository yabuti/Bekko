<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'items' => ['required', 'array', 'min:1', 'max:50'],
            'items.*.id' => ['required', 'integer', 'exists:menu_items,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:50'],
            'notes' => ['nullable', 'string', 'max:500'],
        ];
    }
}
