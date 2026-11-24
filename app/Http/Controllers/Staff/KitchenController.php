<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Inertia\Inertia;
use Inertia\Response;

class KitchenController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Staff/Kitchen', [
            'orders' => Order::query()
                ->with(['items', 'cafeTable'])
                ->whereIn('status', ['new', 'preparing', 'ready'])
                ->oldest()
                ->get(),
        ]);
    }
}
