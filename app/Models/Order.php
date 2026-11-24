<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['cafe_table_id', 'token', 'status', 'total', 'notes'])]
class Order extends Model
{
    /** @var array<string, string> */
    protected $attributes = [
        'status' => 'new',
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
