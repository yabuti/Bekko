<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOrderRequest;
use App\Models\CafeTable;
use App\Models\MenuItem;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function store(StoreOrderRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $lines = collect($data['items']);

        $menuItems = MenuItem::query()
            ->whereIn('id', $lines->pluck('id'))
            ->get()
            ->keyBy('id');

        $total = 0;
        $orderLines = [];

        foreach ($lines as $line) {
            $menuItem = $menuItems->get($line['id']);
            $quantity = (int) $line['quantity'];

            $orderLines[] = [
                'menu_item_id' => $menuItem->id,
                'name' => $menuItem->name,
                'price' => $menuItem->price,
                'quantity' => $quantity,
            ];

            $total += $menuItem->price * $quantity;
        }

        $tableId = $data['order_type'] === 'dine_in'
            ? CafeTable::query()->where('code', $data['table_number'])->value('id')
            : null;

        $order = DB::transaction(function () use ($data, $tableId, $orderLines, $total) {
            $order = Order::create([
                'cafe_table_id' => $tableId,
                'customer_name' => $data['customer_name'],
                'order_type' => $data['order_type'],
                'delivery_location' => $data['order_type'] === 'delivery' ? $data['delivery_location'] : null,
                'token' => Str::uuid()->toString(),
                'status' => 'pending',
                'total' => $total,
                'notes' => $data['notes'] ?? null,
            ]);

            $order->items()->createMany($orderLines);

            return $order;
        });

        return redirect()->route('orders.status', $order->token);
    }

    public function show(Order $order): Response
    {
        $order->load(['items', 'cafeTable']);

        return Inertia::render('OrderStatus', [
            'order' => [
                'id' => $order->id,
                'token' => $order->token,
                'status' => $order->status,
                'total' => $order->total,
                'notes' => $order->notes,
                'customer_name' => $order->customer_name,
                'order_type' => $order->order_type,
                'delivery_location' => $order->delivery_location,
                'created_at' => $order->created_at->toIso8601String(),
                'table' => ['name' => $order->cafeTable?->name],
                'items' => $order->items->map(fn ($item) => [
                    'id' => $item->id,
                    'name' => $item->name,
                    'price' => $item->price,
                    'quantity' => $item->quantity,
                ]),
            ],
        ]);
    }
}
