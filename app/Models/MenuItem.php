<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable(['category', 'category_label', 'group_label', 'name', 'price', 'image', 'sort_order'])]
class MenuItem extends Model
{
    use HasFactory;
    use SoftDeletes;

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}
