<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Installment\StoreInstallmentRequest;
use App\Models\Installment;
use App\Models\InstallmentPayment;
use App\Services\InstallmentService;
use Illuminate\Http\Request;

class InstallmentController extends Controller
{
    public function __construct(private InstallmentService $installmentService) {}

    // GET /api/installments
    public function index(Request $request)
    {
        $installments = $this->installmentService->getAll($request->query('status'));

        return response()->json([
            'status' => 'success',
            'data'   => $installments,
        ]);
    }

    // POST /api/installments
    public function store(StoreInstallmentRequest $request)
    {
        $installment = $this->installmentService->store($request->validated());

        return response()->json([
            'status'  => 'success',
            'message' => 'تم إنشاء القسط وتوليد جدول السداد بنجاح',
            'data'    => $installment,
        ], 201);
    }

    // GET /api/installments/{id}
    public function show(Installment $installment)
    {
        $this->authorize('view', $installment);

        return response()->json([
            'status' => 'success',
            'data'   => $installment->load('payments'),
        ]);
    }

    // PATCH /api/installments/{installment}/payments/{payment}/pay
    public function markAsPaid(Installment $installment, InstallmentPayment $payment)
    {
        $this->authorize('update', $installment);

        $payment = $this->installmentService->markPaymentAsPaid($installment, $payment);

        return response()->json([
            'status'  => 'success',
            'message' => 'تم تسجيل الدفعة كمدفوعة',
            'data'    => $payment,
        ]);
    }

    // DELETE /api/installments/{id}
    public function destroy(Installment $installment)
    {
        $this->authorize('delete', $installment);

        $this->installmentService->delete($installment);

        return response()->json([
            'status'  => 'success',
            'message' => 'تم حذف القسط وجميع دفعاته',
        ]);
    }
}