<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Profile\UpdateProfileRequest;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        return response()->json([
            'status' => 'success',
            'data'   => $request->user(),
        ]);
    }

    public function update(UpdateProfileRequest $request)
    {
        $user = $request->user();
        $user->update($request->validated());

        return response()->json([
            'status'  => 'success',
            'message' => 'تم تحديث البيانات بنجاح',
            'data'    => $user,
        ]);
    }
}
