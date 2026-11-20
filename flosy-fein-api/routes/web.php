<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\ExpenseController;
use App\Http\Controllers\Api\InstallmentController;
use App\Http\Controllers\Api\DashboardController;

// ===== Public Routes (مش محتاج Login) =====
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login',    [AuthController::class, 'login']);
    Route::get('google',          [AuthController::class, 'googleRedirect']);
    Route::get('google/callback', [AuthController::class, 'googleCallback']);
});

// ===== Protected Routes (محتاج Login) =====
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('auth/logout', [AuthController::class, 'logout']);

    // Profile
    Route::get('profile', [ProfileController::class, 'show']);
    Route::put('profile', [ProfileController::class, 'update']);

    // Expenses
    Route::apiResource('expenses', ExpenseController::class);

    // Installments
    Route::apiResource('installments', InstallmentController::class);
    Route::patch(
        'installments/{installment}/payments/{payment}/pay',
        [InstallmentController::class, 'markAsPaid']
    );

    // Dashboard
    Route::get('dashboard', [DashboardController::class, 'index']);
});