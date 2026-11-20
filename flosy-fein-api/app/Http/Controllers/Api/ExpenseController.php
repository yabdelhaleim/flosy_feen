<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Expense\StoreExpenseRequest;
use App\Http\Requests\Expense\UpdateExpenseRequest;
use App\Models\Expense;
use App\Services\ExpenseService;
use Illuminate\Http\Request;

class ExpenseController extends Controller
{
    public function __construct(private ExpenseService $expenseService) {}

    // GET /expenses
    public function index(Request $request)
    {
        $result = $this->expenseService->getAll($request->only([
            'month', 'category', 'from', 'to'
        ]));

        return response()->json([
            'status' => 'success',
            'data'   => $result,
        ]);
    }

    // POST /expenses
    public function store(StoreExpenseRequest $request)
    {
        $expense = $this->expenseService->store($request->validated());

        return response()->json([
            'status'  => 'success',
            'message' => 'تم إضافة المصروف',
            'data'    => $expense,
        ], 201);
    }

    // GET /expenses/{id}
    public function show(Expense $expense)
    {
        // تأكد إن المصروف تبع اليوزر الحالي
        $this->authorize('view', $expense);

        return response()->json([
            'status' => 'success',
            'data'   => $expense,
        ]);
    }

    // PUT /expenses/{id}
    public function update(UpdateExpenseRequest $request, Expense $expense)
    {
        $this->authorize('update', $expense);

        $expense = $this->expenseService->update($expense, $request->validated());

        return response()->json([
            'status'  => 'success',
            'message' => 'تم التعديل',
            'data'    => $expense,
        ]);
    }

    // DELETE /expenses/{id}
    public function destroy(Expense $expense)
    {
        $this->authorize('delete', $expense);

        $this->expenseService->delete($expense);

        return response()->json([
            'status'  => 'success',
            'message' => 'تم الحذف',
        ]);
    }
}