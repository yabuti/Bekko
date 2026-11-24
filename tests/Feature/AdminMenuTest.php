<?php

namespace Tests\Feature;

use App\Models\CafeTable;
use App\Models\MenuItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class AdminMenuTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_view_the_menu_manager_with_database_items(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        MenuItem::factory()->create(['name' => 'Test Injera']);

        $this->actingAs($admin)
            ->get(route('staff.menu'))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('Staff/Menu')
                ->where('items.0.name', 'Test Injera')
                ->etc());
    }

    public function test_guests_are_redirected_to_staff_login(): void
    {
        $this->get(route('staff.menu'))->assertRedirect(route('staff.login'));
        $this->post(route('staff.menu.store'), [])->assertRedirect(route('staff.login'));
    }

    #[DataProvider('unprivilegedRoles')]
    public function test_non_admin_staff_cannot_manage_the_menu(string $role): void
    {
        $user = User::factory()->create(['role' => $role]);
        $item = MenuItem::factory()->create();

        $this->actingAs($user)->get(route('staff.menu'))->assertForbidden();
        $this->actingAs($user)->post(route('staff.menu.store'), [])->assertForbidden();
        $this->actingAs($user)->put(route('staff.menu.update', $item), [])->assertForbidden();
        $this->actingAs($user)->delete(route('staff.menu.destroy', $item))->assertForbidden();
    }

    public static function unprivilegedRoles(): array
    {
        return [
            ['waiter'],
            ['kitchen'],
        ];
    }

    public function test_admin_can_add_a_meal(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)
            ->post(route('staff.menu.store'), [
                'name' => 'New Special Coffee',
                'category' => 'drinks',
                'group_label' => 'Hot Drinks',
                'price' => 180,
                'sort_order' => 0,
            ])
            ->assertSessionHasNoErrors();

        $this->assertDatabaseHas('menu_items', [
            'name' => 'New Special Coffee',
            'category' => 'drinks',
            'category_label' => 'Drinks',
            'group_label' => 'Hot Drinks',
            'price' => 180,
            'image' => '/images/coffee.svg',
        ]);
    }

    public function test_meal_validation_rejects_invalid_data(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        MenuItem::factory()->create(['name' => 'Already There']);

        $this->actingAs($admin)->post(route('staff.menu.store'), [
            'name' => 'Already There',
            'category' => 'drinks',
            'price' => 100,
        ])->assertSessionHasErrors('name');

        $this->actingAs($admin)->post(route('staff.menu.store'), [
            'name' => 'Bad Category',
            'category' => 'unknown',
            'price' => 100,
        ])->assertSessionHasErrors('category');

        $this->actingAs($admin)->post(route('staff.menu.store'), [
            'name' => 'Bad Price',
            'category' => 'drinks',
            'price' => -5,
        ])->assertSessionHasErrors('price');

        $this->actingAs($admin)->post(route('staff.menu.store'), [
            'name' => 'Bad Photo',
            'category' => 'drinks',
            'price' => 100,
            'image' => UploadedFile::fake()->create('notes.txt', 10, 'text/plain'),
        ])->assertSessionHasErrors('image');

        $this->assertDatabaseCount('menu_items', 1);
    }

    public function test_admin_can_edit_a_meal_and_its_price(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $item = MenuItem::factory()->create([
            'name' => 'Old Name',
            'category' => 'breakfast',
            'price' => 100,
        ]);

        $this->actingAs($admin)
            ->put(route('staff.menu.update', $item), [
                'name' => 'Renamed Meal',
                'category' => 'breakfast',
                'group_label' => 'Main',
                'price' => 350,
                'sort_order' => 5,
            ])
            ->assertSessionHasNoErrors();

        $this->assertDatabaseHas('menu_items', [
            'id' => $item->id,
            'name' => 'Renamed Meal',
            'group_label' => 'Main',
            'price' => 350,
            'sort_order' => 5,
        ]);
        $this->assertDatabaseMissing('menu_items', ['name' => 'Old Name']);
    }

    public function test_admin_can_upload_replace_and_remove_a_photo(): void
    {
        Storage::fake('menu_photos');
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)
            ->post(route('staff.menu.store'), [
                'name' => 'Photo Meal',
                'category' => 'lunch',
                'price' => 200,
                'image' => UploadedFile::fake()->create('first.jpg', 10, 'image/jpeg'),
            ])
            ->assertSessionHasNoErrors();

        $item = MenuItem::where('name', 'Photo Meal')->firstOrFail();
        $this->assertStringStartsWith('/menu-photos/', $item->image);
        $firstPhoto = Str::after($item->image, '/menu-photos/');
        Storage::disk('menu_photos')->assertExists($firstPhoto);

        $this->actingAs($admin)
            ->put(route('staff.menu.update', $item), [
                'name' => 'Photo Meal',
                'category' => 'lunch',
                'price' => 200,
                'image' => UploadedFile::fake()->create('second.png', 10, 'image/png'),
            ])
            ->assertSessionHasNoErrors();

        $item->refresh();
        $secondPhoto = Str::after($item->image, '/menu-photos/');
        $this->assertNotSame($firstPhoto, $secondPhoto);
        Storage::disk('menu_photos')->assertMissing($firstPhoto);
        Storage::disk('menu_photos')->assertExists($secondPhoto);

        $this->actingAs($admin)
            ->put(route('staff.menu.update', $item), [
                'name' => 'Photo Meal',
                'category' => 'lunch',
                'price' => 200,
                'remove_photo' => true,
            ])
            ->assertSessionHasNoErrors();

        $item->refresh();
        $this->assertSame('/images/lunch.svg', $item->image);
        Storage::disk('menu_photos')->assertMissing($secondPhoto);
    }

    public function test_deleting_a_meal_keeps_historical_order_lines(): void
    {
        Storage::fake('menu_photos');
        $admin = User::factory()->create(['role' => 'admin']);
        $item = MenuItem::factory()->create();
        $table = CafeTable::create(['code' => 'T99', 'name' => 'Test Table']);
        $order = Order::create([
            'cafe_table_id' => $table->id,
            'token' => 'test-token',
            'status' => 'new',
            'total' => $item->price,
        ]);
        OrderItem::create([
            'order_id' => $order->id,
            'menu_item_id' => $item->id,
            'name' => $item->name,
            'price' => $item->price,
            'quantity' => 1,
        ]);

        $this->actingAs($admin)
            ->delete(route('staff.menu.destroy', $item))
            ->assertSessionHasNoErrors();

        $this->assertSoftDeleted('menu_items', ['id' => $item->id]);
        $this->assertDatabaseHas('order_items', [
            'order_id' => $order->id,
            'menu_item_id' => $item->id,
        ]);
    }

    public function test_admin_changes_appear_on_public_and_customer_menus(): void
    {
        $item = MenuItem::factory()->create([
            'name' => 'Admin Added Special',
            'category' => 'breakfast',
            'price' => 777,
        ]);

        $this->get('/menu')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('Menu')
                ->where('items.0.name', 'Admin Added Special')
                ->where('items.0.price', 777)
                ->etc());

        $table = CafeTable::create(['code' => 'T99', 'name' => 'Test Table']);

        $this->get(route('tables.menu', $table))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('CustomerMenu')
                ->where('items.0.name', 'Admin Added Special')
                ->etc());
    }
}
