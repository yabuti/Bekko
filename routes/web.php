<?php

use App\Http\Controllers\CustomerMenuController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\Staff\KitchenController;
use App\Http\Controllers\Staff\OrderStatusController;
use App\Http\Controllers\Staff\TableQrController;
use App\Http\Controllers\Staff\WaiterController;
use App\Http\Controllers\StaffAuthController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/t/{cafeTable:code}', [CustomerMenuController::class, 'show'])->name('tables.menu');
Route::post('/t/{cafeTable:code}/orders', [OrderController::class, 'store'])->name('orders.store');
Route::get('/orders/{order:token}', [OrderController::class, 'show'])->name('orders.status');

Route::get('/staff/login', [StaffAuthController::class, 'showLogin'])->name('staff.login');
Route::post('/staff/login', [StaffAuthController::class, 'login'])->middleware('throttle:5,1')->name('staff.login.store');
Route::post('/staff/logout', [StaffAuthController::class, 'logout'])->name('staff.logout');

Route::middleware(['auth', 'staff:waiter,admin'])->group(function () {
    Route::get('/staff/waiter', [WaiterController::class, 'index'])->name('staff.waiter');
});

Route::middleware(['auth', 'staff:kitchen,admin'])->group(function () {
    Route::get('/staff/kitchen', [KitchenController::class, 'index'])->name('staff.kitchen');
});

Route::middleware(['auth', 'staff:waiter,kitchen,admin'])->group(function () {
    Route::post('/staff/orders/{order}/status', [OrderStatusController::class, 'update'])->name('staff.orders.status');
    Route::get('/staff/tables', [TableQrController::class, 'index'])->name('staff.tables');
});
