<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class OrderStatusController extends Controller
{
    public function update(Request $request, Order $order): RedirectResponse
    {
        $status = $request->validate([
            'status' => ['required', Rule::in(['preparing', 'ready', 'served'])],
        ])['status'];

        $allowed = match ($request->user()->role) {
            'kitchen' => ['preparing', 'ready'],
            'waiter' => ['served'],
            'admin' => ['preparing', 'ready', 'served'],
            default => [],
        };

        abort_unless(in_array($status, $allowed, true), 403);

        $next = [
            'new' => 'preparing',
            'preparing' => 'ready',
            'ready' => 'served',
        ];

        if (($next[$order->status] ?? null) !== $status) {
            throw ValidationException::withMessages([
                'status' => __('messages.order_status_sequence'),
            ]);
        }

        $order->update(['status' => $status]);

        return back();
    }
}
