<?php

namespace App\Models;

use App\Enum\Status;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;
    protected $fillable=[
        "userId",
        "description",
        "employeeId",
        "status",
        "address"
    ];
    protected $appends = ["itemsCount"];
    protected $casts=[
        'status'=>Status::class
    ];

    public function getItemsCountAttribute() {
        return $this->orderItems()->count();
    }

    public function user(){
        return $this->belongsTo(User::class,'userId','id');
    }

    public function items() {
        return $this->hasManyThrough(Item::class, OrderItem::class,"orderId","id","id","itemId")->with(["orderItems"]);
    }
    public function orderItems(){
        return $this->hasMany(OrderItem::class,'orderId','id');
    }
    public function employee(){
        return $this->belongsTo(User::class,"employeeId","id");
    }

    public function complaints(){
        return $this->hasMany(Complaint::class,'orderId','id');
    }

}
