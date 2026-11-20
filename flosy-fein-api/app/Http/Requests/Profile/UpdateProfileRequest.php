<?php

namespace App\Http\Requests\Profile;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'          => 'sometimes|string|max:100',
            'salary_amount' => 'nullable|numeric|min:0',
            'salary_day'    => 'nullable|integer|between:1,31',
        ];
    }

    public function messages(): array
    {
        return [
            'salary_amount.numeric' => 'قيمة المرتب يجب أن تكون رقماً',
            'salary_day.between'    => 'يوم القبض يجب أن يكون يوماً من 1 إلى 31',
        ];
    }
}
