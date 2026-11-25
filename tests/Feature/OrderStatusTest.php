<?php

namespace Tests\Feature;

use App\Models\CafeTable;
use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class OrderStatusTest extends TestCase
{
    use RefreshDatabase;

    public function test_kitchen_moves_orders_through_preparing_and_ready(): void
    {
        $kitchen = User::factory()->create(['role' => 'kitchen']);
        $order = $this->order('new');

        $this->actingAs($kitchen)
            ->post(route('staff.orders.status', $order), ['status' => 'preparing'])
            ->assertSessionHasNoErrors();

        $this->assertSame('preparing', $order->fresh()->status);

        $this->actingAs($kitchen)
            ->post(route('staff.orders.status', $order), ['status' => 'ready'])
            ->assertSessionHasNoErrors();

        $this->assertSame('ready', $order->fresh()->status);
    }

    public function test_waiter_serves_ready_orders(): void
    {
        $waiter = User::factory()->create(['role' => 'waiter']);
        $order = $this->order('ready');

        $this->actingAs($waiter)
            ->post(route('staff.orders.status', $order), ['status' => 'served'])
            ->assertSessionHasNoErrors();

        $this->assertSame('served', $order->fresh()->status);
    }

    #[DataProvider('invalidTransitions')]
    public function test_staff_cannot_skip_or_reverse_status_steps(string $role, string $from, string $target): void
    {
        $user = User::factory()->create(['role' => $role]);
        $order = $this->order($from);

        $this->actingAs($user)
            ->post(route('staff.orders.status', $order), ['status' => $target])
            ->assertSessionHasErrors('status');

        $this->assertSame($from, $order->fresh()->status);
    }

    public static function invalidTransitions(): array
    {
        return [
            ['kitchen', 'new', 'ready'],
            ['waiter', 'new', 'served'],
            ['waiter', 'preparing', 'served'],
            ['admin', 'new', 'served'],
            ['admin', 'ready', 'preparing'],
        ];
    }

    #[DataProvider('forbiddenTransitions')]
    public function test_staff_cannot_perform_another_roles_step(string $role, string $from, string $target): void
    {
        $user = User::factory()->create(['role' => $role]);
        $order = $this->order($from);

        $this->actingAs($user)
            ->post(route('staff.orders.status', $order), ['status' => $target])
            ->assertForbidden();

        $this->assertSame($from, $order->fresh()->status);
    }

    public static function forbiddenTransitions(): array
    {
        return [
            ['kitchen', 'ready', 'served'],
            ['waiter', 'new', 'preparing'],
            ['waiter', 'preparing', 'ready'],
        ];
    }

    private function order(string $status): Order
    {
        $table = CafeTable::create(['code' => 'T98', 'name' => 'Test Table']);

        return Order::create([
            'cafe_table_id' => $table->id,
            'token' => 'status-test-token',
            'status' => $status,
            'total' => 100,
        ]);
    }
}
