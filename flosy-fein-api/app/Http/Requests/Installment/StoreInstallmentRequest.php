<?php

namespace App\Http\Requests\Installment;

use Illuminate\Foundation\Http\FormRequest;

class StoreInstallmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title'              => 'required|string|max:255',
            'amount'             => 'required|numeric|min:0.01',
            'type'               => 'required|in:one_time,recurring',
            'start_date'         => 'required|date',
            'total_installments' => 'required_if:type,recurring|nullable|integer|min:2|max:120',
            'description'        => 'nullable|string|max:500',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required'              => 'اسم القسط مطلوب',
            'amount.required'             => 'قيمة القسط مطلوبة',
            'amount.min'                  => 'المبلغ يجب أن يكون أكبر من صفر',
            'type.required'               => 'نوع القسط مطلوب (مرة واحدة أو متكرر)',
            'start_date.required'         => 'تاريخ أول استحقاق مطلوب',
            'total_installments.required_if' => 'عدد الأقساط مطلوب في حالة القسط المتكرر',
            'total_installments.min'      => 'عدد الأقساط يجب ألا يقل عن قسطين',
        ];
    }
}