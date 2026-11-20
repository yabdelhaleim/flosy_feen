<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Services\AuthService;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{
    public function __construct(private AuthService $authService) {}

    public function register(RegisterRequest $request)
    {
        $result = $this->authService->register($request->validated());

        return response()->json([
            'status'  => 'success',
            'message' => 'تم إنشاء الحساب بنجاح',
            'data'    => $result,
        ], 201);
    }

    public function login(LoginRequest $request)
    {
        $result = $this->authService->login($request->validated());

        if (!$result) {
            return response()->json([
                'status'  => 'error',
                'message' => 'البريد الإلكتروني أو كلمة المرور غلط',
            ], 401);
        }

        return response()->json([
            'status' => 'success',
            'data'   => $result,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status'  => 'success',
            'message' => 'تم تسجيل الخروج',
        ]);
    }

    public function googleRedirect()
    {
        return response()->json([
            'status' => 'success',
            'data'   => [
                'url' => Socialite::driver('google')->stateless()->redirect()->getTargetUrl(),
            ],
        ]);
    }

    public function googleCallback()
    {
        $result = $this->authService->handleGoogleCallback();

        return response()->json([
            'status' => 'success',
            'data'   => $result,
        ]);
    }
}