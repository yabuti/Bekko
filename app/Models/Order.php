<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['cafe_table_id', 'customer_name', 'order_type', 'delivery_location', 'token', 'status', 'total', 'notes'])]
class Order extends Model
{
    /** @var array<string, string> */
    protected $attributes = [
        'status' => 'pending',
        'order_type' => 'dine_in',
    ];

    public function cafeTable(): BelongsTo
    {
        return $this->belongsTo(CafeTable::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}
