<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Complaint extends Model
{
    use HasFactory;
    protected $with = ["creator"];
    protected $fillable=[
        "orderId",
        "description",
        "createdBy",
        "isReply",
    ];

    public function creator(){
        return $this->belongsTo(User::class,"createdBy","id");
    }
    public function order(){
        return $this->belongsTo(Order::class,"orderId","id");
    }
}
