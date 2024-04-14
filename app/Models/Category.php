<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;
    protected $table="categories";
    protected $appends = ["hasItems"];
    protected $hidden = ["created_at", "updated_at"];
    protected $fillable=[
        "name",
        "photoUrl"
    ];

    public function getHasItemsAttribute() {
        return $this->items()->count() > 0;
    }

    public function items(){
        return $this->hasMany(Item::class,'categoryId','id');
    }
    public function orders(){
        return $this->hasMany(Order::class,'categoryId','id');
    }
}
