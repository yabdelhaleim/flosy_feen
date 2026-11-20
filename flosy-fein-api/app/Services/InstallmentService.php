<?php

namespace App\Services;

use App\Models\Installment;
use App\Models\InstallmentPayment;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class InstallmentService
{
    /**
     * جلب كل الأقساط مع دفعاتها، مع إمكانية الفلترة بحالة القسط
     */
    public function getAll(?string $status = null)
    {
        $query = Auth::user()->installments()->with(['payments' => function ($q) use ($status) {
            if ($status) {
                $q->where('status', $status);
            }
            $q->orderBy('due_date', 'asc');
        }]);

        return $query->latest()->get();
    }

    /**
     * إضافة قسط جديد وتوليد دفعاته تلقائياً في Database Transaction
     */
    public function store(array $data): Installment
    {
        return DB::transaction(function () use ($data) {
            // 1. إنشاء القسط الأساسي
            $installment = Auth::user()->installments()->create($data);

            // 2. توليد الدفعات
            $startDate = Carbon::parse($data['start_date']);

            if ($data['type'] === 'one_time') {
                // قسط لمرة واحدة -> دفعة واحدة فقط
                $installment->payments()->create([
                    'due_date' => $startDate->toDateString(),
                    'status'   => 'upcoming',
                ]);
            } else {
                // قسط متكرر -> توليد دفعات بعدد الشهور
                $totalMonths = (int) $data['total_installments'];
                $payments = [];

                for ($i = 0; $i < $totalMonths; $i++) {
                    $payments[] = [
                        'installment_id' => $installment->id,
                        'due_date'       => $startDate->copy()->addMonths($i)->toDateString(),
                        'status'         => 'upcoming',
                        'created_at'     => now(),
                        'updated_at'     => now(),
                    ];
                }

                InstallmentPayment::insert($payments);
            }

            return $installment->load('payments');
        });
    }

    /**
     * تسجيل دفعة معينة كـ "تم الدفع"
     */
    public function markPaymentAsPaid(Installment $installment, InstallmentPayment $payment): InstallmentPayment
    {
        // التأكد أن الدفعة تنتمي لهذا القسط فعلاً
        if ($payment->installment_id !== $installment->id) {
            abort(404, 'الدفعة غير تابعة لهذا القسط');
        }

        $payment->update([
            'status'  => 'paid',
            'paid_at' => now(),
        ]);

        return $payment;
    }

    /**
     * حذف القسط (سيحذف كل دفعاته تلقائياً بسبب cascadeOnDelete)
     */
    public function delete(Installment $installment): void
    {
        $installment->delete();
    }
}