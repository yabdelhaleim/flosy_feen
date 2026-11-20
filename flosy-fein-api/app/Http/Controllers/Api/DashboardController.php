<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\DashboardService;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __construct(private DashboardService $dashboardService) {}

    public function index(Request $request)
    {
        $summary = $this->dashboardService->getSummary(
            $request->user(),
            $request->query('month')
        );

        return response()->json([
            'status' => 'success',
            'data'   => $summary,
        ]);
    }
}
