<?php

namespace App\Http\Requests\Expense;

use Illuminate\Foundation\Http\FormRequest;

class UpdateExpenseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title'       => 'sometimes|string|max:255',
            'amount'      => 'sometimes|numeric|min:0.01',
            'category'    => 'sometimes|in:food,transport,shopping,bills,housing,health,entertainment,other',
            'date'        => 'sometimes|date',
            'description' => 'nullable|string|max:500',
        ];
    }

    public function messages(): array
    {
        return [
            'amount.min'     => 'المبلغ لازم يكون أكبر من صفر',
            'category.in'    => 'التصنيف غير صحيح',
            'date.date'      => 'التاريخ غير صحيح',
        ];
    }
}