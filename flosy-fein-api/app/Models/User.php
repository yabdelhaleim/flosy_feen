<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'google_id',
        'avatar',
        'salary_amount',
        'salary_day',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'google_id',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'salary_amount'     => 'decimal:2',
        'salary_day'        => 'integer',
        'password'          => 'hashed',
    ];

    public function expenses()
    {
        return $this->hasMany(Expense::class);
    }

    public function installments()
    {
        return $this->hasMany(Installment::class);
    }
}
