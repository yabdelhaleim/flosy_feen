<?php

namespace App\Http\Requests\Expense;

use Illuminate\Foundation\Http\FormRequest;

class StoreExpenseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title'       => 'required|string|max:255',
            'amount'      => 'required|numeric|min:0.01',
            'category'    => 'required|in:food,transport,shopping,bills,housing,health,entertainment,other',
            'date'        => 'required|date',
            'description' => 'nullable|string|max:500',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required'    => 'اسم المصروف مطلوب',
            'amount.required'   => 'المبلغ مطلوب',
            'amount.min'        => 'المبلغ لازم يكون أكبر من صفر',
            'category.required' => 'التصنيف مطلوب',
            'category.in'       => 'التصنيف غير صحيح',
            'date.required'     => 'التاريخ مطلوب',
            'date.date'         => 'التاريخ غير صحيح',
        ];
    }
}