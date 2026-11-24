<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\CafeTable;
use Inertia\Inertia;
use Inertia\Response;

class TableQrController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Staff/Tables', [
            'tables' => CafeTable::query()
                ->orderBy('code')
                ->get(['id', 'code', 'name']),
        ]);
    }
}
