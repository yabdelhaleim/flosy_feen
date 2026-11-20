<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InstallmentPayment extends Model
{
    protected $fillable = [
        'installment_id',
        'due_date',
        'status',
        'paid_at',
    ];

    protected $casts = [
        'due_date' => 'date',
        'paid_at'  => 'datetime',
    ];

    public function installment()
    {
        return $this->belongsTo(Installment::class);
    }
}