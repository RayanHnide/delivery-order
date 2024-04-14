<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;
    protected $fillable=[
        "orderId",
        "categoryId",
        "itemId",
        "quantity",
        'description'
    ];
    public function order(){
        return $this->belongsTo(Order::class,'orderId','id');
    }
    public function category(){
        return $this->belongsTo(Category::class,'categoryId','id');
    }
    public function item(){
        return $this->belongsTo(Item::class,'itemId','id');
    }
}
