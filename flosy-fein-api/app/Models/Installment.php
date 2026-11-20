<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Installment extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'amount',
        'type',
        'start_date',
        'total_installments',
        'description',
    ];

    protected $casts = [
        'amount'             => 'decimal:2',
        'start_date'         => 'date',
        'total_installments' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function payments()
    {
        return $this->hasMany(InstallmentPayment::class);
    }
}