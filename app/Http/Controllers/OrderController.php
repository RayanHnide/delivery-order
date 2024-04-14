<?php

namespace App\Http\Controllers;

use App\Http\Requests\AddEmployeeOrderRequest;
use App\Http\Requests\AddOrderRequest;
use App\Http\Requests\ChangeStatusRequest;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function add(AddOrderRequest $request)
    {
        DB::transaction(function () use ($request) {
            $data = $request->only(["address","description"]);
            $data["userId"] = auth()->user()->id;
            $order = Order::query()->create($data);
            foreach ($request->get("services") ?? [] as $s) {
                $d = array_key_exists("itemId", $s) ? ["itemId" => $s["itemId"]] : [];
                $d["categoryId"] = $s["categoryId"];
                if (array_key_exists("quantity", $s)) {
                    $d["quantity"] = $s["quantity"];
                }
                if (array_key_exists("description", $s)) {
                    $d["description"] = $s["description"];
                }
                $order->orderItems()->create($d);
            }
        });
        return "order added successfully";
    }

    public function viewMyOrders(Request $request)
    {
        $status = $request->get("status") ?? "";
        if (!in_array($status, ["all", "pending", "done", "in-progress", "canceled"])) {
            return null;
        }
        $user = auth()->user();
        $with = ["orderItems.item"];
        if ($user->hasRole("admin")) {
            $with = ["orderItems.item", 'user', 'employee'];
            $q = Order::query();
        } else if ($user->hasRole("employee")) {
            $with = ["orderItems.item", 'user'];
            $q = Order::query()->where("employeeId", $user->id);
        } else {
            $q = Order::query()->where('userId', $user->id);
        }
        if ($status != "all") {
            $q = $q->where("status", $status);
        }
        return $q->orderBy("created_at", 'DESC')->with($with)->get();
    }

    public function viewOrderDetails(Order $order)
    {
        $user = auth()->user();
        if ($user->hasRole("user")) {
            throw_if($order->userId != $user->id, "access denied!");
        } else if ($user->hasRole("employee")) {
            throw_if($order->employeeId != $user->id, "access denied!");
        }
        return Order::query()->where("id", $order->id)->with(["orderItems.category","orderItems.item", "complaints", "employee", "user"])->first();
    }

    public function addEmployeeForOrder(AddEmployeeOrderRequest $request, Order $order)
    {
        $order->update([
            "employeeId" => $request->get("employeeId")
        ]);
    }

    public function changeStatusOrder(ChangeStatusRequest $request, Order $order)
    {
        $order->update([
            "status" => $request->get("status")
        ]);
    }
}
