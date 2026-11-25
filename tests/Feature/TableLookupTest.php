<?php

namespace Tests\Feature;

use App\Models\CafeTable;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class TableLookupTest extends TestCase
{
    use RefreshDatabase;

    public function test_table_number_redirects_to_that_tables_menu(): void
    {
        CafeTable::create(['code' => 'T2', 'name' => 'Table 2']);

        $this->post(route('order.table'), ['table_number' => '2'])
            ->assertRedirect(route('tables.menu', 'T2'))
            ->assertSessionHasNoErrors();
    }

    public function test_table_lookup_accepts_a_prefixed_table_code(): void
    {
        CafeTable::create(['code' => 'T5', 'name' => 'Table 5']);

        $this->post(route('order.table'), ['table_number' => ' T5 '])
            ->assertRedirect(route('tables.menu', 'T5'))
            ->assertSessionHasNoErrors();
    }

    #[DataProvider('invalidTableNumbers')]
    public function test_table_lookup_rejects_missing_or_unknown_tables(string $value): void
    {
        CafeTable::create(['code' => 'T1', 'name' => 'Table 1']);

        $this->post(route('order.table'), ['table_number' => $value])
            ->assertSessionHasErrors('table_number');
    }

    public static function invalidTableNumbers(): array
    {
        return [
            [''],
            ['99'],
            ['abc'],
        ];
    }
}
