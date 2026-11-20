<?php

namespace App\Services;

use App\Models\Expense;
use Illuminate\Support\Facades\Auth;

class ExpenseService
{
    // ✅ جلب كل المصروفات مع الفلاتر
    public function getAll(array $filters): array
    {
        $query = Auth::user()->expenses();

        // فلتر بالشهر
        if (!empty($filters['month'])) {
            $query->whereYear('date', substr($filters['month'], 0, 4))
                  ->whereMonth('date', substr($filters['month'], 5, 2));
        }

        // فلتر بالتصنيف
        if (!empty($filters['category'])) {
            $query->where('category', $filters['category']);
        }

        // فلتر بالتاريخ
        if (!empty($filters['from'])) {
            $query->whereDate('date', '>=', $filters['from']);
        }
        if (!empty($filters['to'])) {
            $query->whereDate('date', '<=', $filters['to']);
        }

        $expenses = $query->orderBy('date', 'desc')->get();

        return [
            'expenses' => $expenses,
            'total'    => $expenses->sum('amount'),
        ];
    }

    // ✅ إضافة مصروف جديد
    public function store(array $data): Expense
    {
        return Auth::user()->expenses()->create($data);
    }

    // ✅ تعديل مصروف
    public function update(Expense $expense, array $data): Expense
    {
        $expense->update($data);
        return $expense->fresh();
    }

    // ✅ حذف مصروف
    public function delete(Expense $expense): void
    {
        $expense->delete();
    }
}