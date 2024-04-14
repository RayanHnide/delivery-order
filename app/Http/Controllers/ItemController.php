<?php

namespace App\Http\Controllers;

use App\Http\Requests\AddItemRequest;
use App\Models\Item;
use Illuminate\Http\Request;

class ItemController extends Controller
{
    public function add(AddItemRequest $request)
    {
        $data = $request->all();
        return Item::create($data);
    }

    public function view(Request $request, $categoryId)
    {
        $q = $request->get("pattern");
        $query = Item::query()->where('categoryId', $categoryId);
        if ($q) {
            $query = $query->where("name", "like", "%" . $q . "%");
        }
        $result = $query->limit(10)->get();
        if (!$result->has("pattern")) {
            return $result->shuffle();
        }
        return $result;
    }
}
