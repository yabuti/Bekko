<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['category', 'category_label', 'group_label', 'name', 'price', 'image', 'sort_order'])]
class MenuItem extends Model
{
    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}
