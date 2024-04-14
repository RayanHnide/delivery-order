<?php

namespace App\Models;

use App\Enum\Units;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    use HasFactory;
    protected $fillable=[
        "name",
        "categoryId",
        "unit"
    ];
    protected $casts=[
        'unit'=>Units::class
    ];

    public function category(){
        return $this->belongsTo(Category::class,'categoryId','id');
    }
    public function orderItems(){
        return $this->hasMany(OrderItem::class,'orderId','id');
    }
}
