<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

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
            'items.*.id' => [
                'required',
                'integer',
                Rule::exists('menu_items', 'id')->whereNull('deleted_at'),
            ],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:50'],
            'customer_name' => ['required', 'string', 'max:120'],
            'order_type' => ['required', 'string', 'in:dine_in,delivery'],
            'table_number' => [
                'exclude_unless:order_type,dine_in',
                'required',
                'string',
                'max:10',
                Rule::in($this->tableCodes()),
                Rule::exists('cafe_tables', 'code'),
            ],
            'delivery_location' => ['exclude_unless:order_type,delivery', 'required', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:500'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'table_number.in' => __('messages.table_not_found'),
            'table_number.exists' => __('messages.table_not_found'),
        ];
    }

    /**
     * @return array<int, string>
     */
    private function tableCodes(): array
    {
        return collect(range(1, 10))
            ->map(fn (int $number): string => 'T'.$number)
            ->all();
    }

    protected function prepareForValidation(): void
    {
        $tableNumber = $this->clean($this->input('table_number', ''));

        $this->merge([
            'customer_name' => $this->clean($this->input('customer_name', '')),
            'delivery_location' => $this->clean($this->input('delivery_location', '')),
            'table_number' => is_string($tableNumber) && preg_match('/^T?\s*(\d{1,2})$/i', $tableNumber, $matches)
                ? 'T'.(int) $matches[1]
                : $tableNumber,
        ]);
    }

    /**
     * Trim scalar input without turning arrays into the string "Array".
     */
    private function clean(mixed $value): mixed
    {
        return is_scalar($value) ? trim((string) $value) : $value;
    }
}
