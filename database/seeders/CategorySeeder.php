<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            "Food & Drinks" => [
                ["name" => "shawerma", "unit" => "piece"],
                ["name" => "kebab", "unit" => "kg"],
                ["name" => "pepsi", "unit" => "litre"],
                ["name" => "water", "unit" => "litre"],
                ["name" => "noodles (box)", "unit" => "box"],
                ["name" => "noodles", "unit" => "piece"],
            ],
            "Shopping" => [
                ["name" => "A4 Papers", "unit" => "box"],
                ["name" => "sugar", "unit" => "kg"],
                ["name" => "tea", "unit" => "box"],
                ["name" => "mateh poperi (half kg)", "unit" => "box"],
                ["name" => "mateh terghwai (half kg)", "unit" => "box"],
                ["name" => "yogurt", "unit" => "kg"],
            ],
            "Ask for Services" => [],
            "export goods" => [],
        ];
        foreach ($data as $categoryName => $items) {
            $category = Category::create(["name" => $categoryName]);
            foreach ($items as $item) {
                $category->items()->create($item);
            }
        }
    }
}
