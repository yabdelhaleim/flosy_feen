<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Laravel\Socialite\Facades\Socialite;

class AuthService
{
    // ✅ تسجيل مستخدم جديد
    public function register(array $data): array
    {
        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return ['user' => $user, 'token' => $token];
    }

    // ✅ تسجيل الدخول
    public function login(array $data): ?array
    {
        $user = User::where('email', $data['email'])->first();

        if (!$user || !Hash::check($data['password'], $user->password)) {
            return null; // فشل الدخول
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return ['user' => $user, 'token' => $token];
    }

    // ✅ Google Login
    public function handleGoogleCallback(): array
    {
        $googleUser = Socialite::driver('google')->stateless()->user();

        $user = User::updateOrCreate(
            ['google_id' => $googleUser->getId()],
            [
                'name'   => $googleUser->getName(),
                'email'  => $googleUser->getEmail(),
                'avatar' => $googleUser->getAvatar(),
            ]
        );

        $token = $user->createToken('auth_token')->plainTextToken;

        return ['user' => $user, 'token' => $token];
    }
}