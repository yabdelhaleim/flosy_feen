<?php

namespace App\Services;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardService
{
    public function getSummary(User $user, ?string $month = null): array
    {
        // 1. تحديد الشهر المستهدف (الافتراضي هو الشهر الحالي)
        $targetDate = $month ? Carbon::parse($month . '-01') : Carbon::now();
        $year = $targetDate->year;
        $monthNum = $targetDate->month;

        // 2. إجمالي المصروفات للشهر المحدد
        $currentMonthExpenses = (float) $user->expenses()
            ->whereYear('date', $year)
            ->whereMonth('date', $monthNum)
            ->sum('amount');

        // 3. مقارنة المصروفات مع الشهر السابق
        $previousDate = $targetDate->copy()->subMonth();
        $previousMonthExpenses = (float) $user->expenses()
            ->whereYear('date', $previousDate->year)
            ->whereMonth('date', $previousDate->month)
            ->sum('amount');

        $comparisonPercentage = 0;
        if ($previousMonthExpenses > 0) {
            $comparisonPercentage = round((($currentMonthExpenses - $previousMonthExpenses) / $previousMonthExpenses) * 100);
        }

        // 4. حسابات الأقساط للشهر المحدد (الدفعات المستحقة في هذا الشهر)
        $paymentsQuery = DB::table('installment_payments')
            ->join('installments', 'installment_payments.installment_id', '=', 'installments.id')
            ->where('installments.user_id', $user->id)
            ->whereYear('installment_payments.due_date', $year)
            ->whereMonth('installment_payments.due_date', $monthNum);

        $upcomingInstallmentsTotal = (float) (clone $paymentsQuery)
            ->where('installment_payments.status', 'upcoming')
            ->sum('installments.amount');

        $upcomingCount = (int) (clone $paymentsQuery)
            ->where('installment_payments.status', 'upcoming')
            ->count();

        $overdueInstallmentsTotal = (float) (clone $paymentsQuery)
            ->where('installment_payments.status', 'overdue')
            ->sum('installments.amount');

        $overdueCount = (int) (clone $paymentsQuery)
            ->where('installment_payments.status', 'overdue')
            ->count();

        $paidInstallmentsTotal = (float) (clone $paymentsQuery)
            ->where('installment_payments.status', 'paid')
            ->sum('installments.amount');

        // 5. حسابات المتبقي من المرتب
        $salary = (float) ($user->salary_amount ?? 0);
        $totalCommitmentInstallments = $upcomingInstallmentsTotal + $overdueInstallmentsTotal;

        $remainingExpensesOnly    = max(0, $salary - $currentMonthExpenses);
        $remainingInstallmentsOnly = max(0, $salary - $totalCommitmentInstallments);
        $remainingBoth            = max(0, $salary - ($currentMonthExpenses + $totalCommitmentInstallments));

        // 6. أقرب الأقساط القادمة
        $upcomingList = DB::table('installment_payments')
            ->join('installments', 'installment_payments.installment_id', '=', 'installments.id')
            ->where('installments.user_id', $user->id)
            ->where('installment_payments.status', 'upcoming')
            ->whereDate('installment_payments.due_date', '>=', Carbon::now()->toDateString())
            ->orderBy('installment_payments.due_date', 'asc')
            ->take(5)
            ->select(
                'installments.id as installment_id',
                'installments.title',
                'installments.amount',
                'installment_payments.id as payment_id',
                'installment_payments.due_date'
            )
            ->get();

        return [
            'month'  => $targetDate->format('Y-m'),
            'salary' => [
                'amount' => $salary,
                'day'    => $user->salary_day,
            ],
            'expenses' => [
                'total'                 => $currentMonthExpenses,
                'comparison_percentage' => $comparisonPercentage,
            ],
            'installments' => [
                'upcoming_count' => $upcomingCount,
                'upcoming_total' => $upcomingInstallmentsTotal,
                'overdue_count'  => $overdueCount,
                'overdue_total'  => $overdueInstallmentsTotal,
                'paid_total'     => $paidInstallmentsTotal,
            ],
            'remaining' => [
                'expenses_only'     => $remainingExpensesOnly,
                'installments_only' => $remainingInstallmentsOnly,
                'both'              => $remainingBoth,
            ],
            'upcoming_installments' => $upcomingList,
        ];
    }
}
