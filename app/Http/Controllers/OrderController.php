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
    public function store(StoreOrderRequest $request, CafeTable $cafeTable): RedirectResponse
    {
        $lines = collect($request->validated()['items']);

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

        $order = DB::transaction(function () use ($cafeTable, $request, $orderLines, $total) {
            $order = Order::create([
                'cafe_table_id' => $cafeTable->id,
                'token' => Str::uuid()->toString(),
                'status' => 'new',
                'total' => $total,
                'notes' => $request->validated()['notes'] ?? null,
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
                'created_at' => $order->created_at->toIso8601String(),
                'table' => ['name' => $order->cafeTable->name],
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
