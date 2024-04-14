<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;
    protected $fillable=[
        'userId',
        "fromCustomer",
        "message",
        "created_at",
        "updated_at"
    ];
    public function user(){
        return $this->belongsTo(User::class,'userId','id');
    }
}
