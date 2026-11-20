<?php

namespace App\Policies;

use App\Models\Expense;
use App\Models\User;

class ExpensePolicy
{
    /**
     * هل مسموح للمستخدم يشوف تفاصيل المصروف؟
     */
    public function view(User $user, Expense $expense): bool
    {
        return $user->id === $expense->user_id;
    }

    /**
     * هل مسموح للمستخدم يعدل المصروف؟
     */
    public function update(User $user, Expense $expense): bool
    {
        return $user->id === $expense->user_id;
    }

    /**
     * هل مسموح للمستخدم يحذف المصروف؟
     */
    public function delete(User $user, Expense $expense): bool
    {
        return $user->id === $expense->user_id;
    }
}