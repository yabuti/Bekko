<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class FindTableRequest extends FormRequest
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
            'table_number' => ['required', 'string', Rule::exists('cafe_tables', 'code')],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'table_number.required' => 'Please enter your table number.',
            'table_number.exists' => 'We could not find that table.',
        ];
    }

    protected function prepareForValidation(): void
    {
        $value = trim((string) $this->input('table_number', ''));

        $this->merge([
            'table_number' => preg_match('/^T?\s*(\d{1,2})$/i', $value, $matches)
                ? 'T'.(int) $matches[1]
                : $value,
        ]);
    }
}
