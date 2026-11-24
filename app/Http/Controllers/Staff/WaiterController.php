<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Inertia\Inertia;
use Inertia\Response;

class WaiterController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Staff/Waiter', [
            'orders' => Order::query()
                ->with(['items', 'cafeTable'])
                ->latest()
                ->limit(100)
                ->get(),
        ]);
    }
}
