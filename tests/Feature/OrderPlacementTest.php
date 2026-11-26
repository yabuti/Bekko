<?php

namespace Tests\Feature;

use App\Models\CafeTable;
use App\Models\MenuItem;
use App\Models\Order;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class OrderPlacementTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_places_a_pending_dine_in_order(): void
    {
        $table = CafeTable::create(['code' => 'T1', 'name' => 'Table 1']);

        $response = $this->post(route('orders.store'), $this->payload([
            'customer_name' => 'Sara',
            'table_number' => '1',
        ]));

        $order = Order::query()->sole();

        $response
            ->assertRedirect(route('orders.status', $order->token))
            ->assertSessionHasNoErrors();

        $this->assertSame('pending', $order->status);
        $this->assertSame('dine_in', $order->order_type);
        $this->assertSame($table->id, $order->cafe_table_id);
        $this->assertSame('Sara', $order->customer_name);
        $this->assertSame(900, $order->total);

        $this->assertDatabaseHas('order_items', [
            'order_id' => $order->id,
            'name' => 'Test Coffee',
            'price' => 450,
            'quantity' => 2,
        ]);
    }

    public function test_customer_places_a_pending_delivery_order_without_a_table(): void
    {
        $response = $this->post(route('orders.store'), $this->payload([
            'order_type' => 'delivery',
            'customer_name' => 'Daniel',
            'delivery_location' => 'Bole, near the main road',
        ]));

        $order = Order::query()->sole();

        $response
            ->assertRedirect(route('orders.status', $order->token))
            ->assertSessionHasNoErrors();

        $this->assertSame('pending', $order->status);
        $this->assertSame('delivery', $order->order_type);
        $this->assertNull($order->cafe_table_id);
        $this->assertSame('Daniel', $order->customer_name);
        $this->assertSame('Bole, near the main road', $order->delivery_location);
    }

    public function test_order_requires_a_customer_name(): void
    {
        $this->post(route('orders.store'), $this->payload([
            'customer_name' => '',
            'table_number' => '1',
        ]))->assertSessionHasErrors([
            'customer_name' => 'The customer name field is required.',
        ]);

        $this->assertDatabaseCount('orders', 0);
    }

    public function test_order_rejects_an_unknown_table_number(): void
    {
        $this->post(route('orders.store'), $this->payload([
            'customer_name' => 'Sara',
            'table_number' => '99',
        ]))->assertSessionHasErrors([
            'table_number' => __('messages.table_not_found'),
        ]);

        $this->assertDatabaseCount('orders', 0);
    }

    public function test_order_rejects_array_inputs_for_customer_details(): void
    {
        $this->post(route('orders.store'), $this->payload([
            'order_type' => 'delivery',
            'customer_name' => ['Sara'],
            'delivery_location' => ['Bole'],
        ]))->assertSessionHasErrors(['customer_name', 'delivery_location']);

        $this->assertDatabaseCount('orders', 0);
    }

    public function test_order_rejects_soft_deleted_menu_items(): void
    {
        $item = MenuItem::factory()->create(['price' => 450]);
        $item->delete();

        $this->post(route('orders.store'), $this->payload([
            'items' => [['id' => $item->id, 'quantity' => 1]],
        ]))->assertSessionHasErrors(['items.0.id']);

        $this->assertDatabaseCount('orders', 0);
    }

    public function test_new_orders_default_to_pending_in_the_database(): void
    {
        $id = DB::table('orders')->insertGetId([
            'cafe_table_id' => CafeTable::create(['code' => 'T1', 'name' => 'Table 1'])->id,
            'token' => 'default-status-token',
            'total' => 100,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->assertSame('pending', DB::table('orders')->where('id', $id)->value('status'));
    }

    public function test_delivery_order_requires_a_location(): void
    {
        $this->post(route('orders.store'), $this->payload([
            'order_type' => 'delivery',
            'customer_name' => 'Daniel',
            'delivery_location' => '',
        ]))->assertSessionHasErrors([
            'delivery_location' => 'The delivery location field is required.',
        ]);

        $this->assertDatabaseCount('orders', 0);
    }

    public function test_tracking_page_exposes_checkout_details_while_pending(): void
    {
        $order = Order::create([
            'customer_name' => 'Sara',
            'order_type' => 'delivery',
            'delivery_location' => 'Bole',
            'token' => 'tracking-test-token',
            'status' => 'pending',
            'total' => 900,
        ]);

        $this->get(route('orders.status', $order->token))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('OrderStatus')
                ->where('order.status', 'pending')
                ->where('order.customer_name', 'Sara')
                ->where('order.delivery_location', 'Bole')
                ->etc());
    }

    /**
     * @param  array<string, mixed>  $overrides
     * @return array<string, mixed>
     */
    private function payload(array $overrides = []): array
    {
        $item = MenuItem::factory()->create([
            'name' => 'Test Coffee',
            'price' => 450,
        ]);

        return array_merge([
            'items' => [
                ['id' => $item->id, 'quantity' => 2],
            ],
            'customer_name' => 'Sara',
            'order_type' => 'dine_in',
            'table_number' => '1',
            'notes' => null,
        ], $overrides);
    }
}
