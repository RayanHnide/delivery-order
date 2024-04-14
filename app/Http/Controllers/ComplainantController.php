<?php

namespace App\Http\Controllers;

use App\Http\Requests\ComplainantRequest;
use App\Models\Complaint;
use Illuminate\Http\Request;

class ComplainantController extends Controller
{
    public function addComplaint(ComplainantRequest $request){
        $data=$request->only(["orderId","description"]);
        $user = auth()->user();
        $data["isReply"] = !$user->hasRole("user");
        $data["createdBy"] = $user->id;
        Complaint::query()->create($data);
    }
    public function updateStatus(Complaint $complaint){
        $complaint->update(["isDone"=>true]);
    }

    public function myComplaints(){
        $user = auth()->user();
        $q = Complaint::query();
        if ($user->hasRole("user")) {
             $q = $q->whereHas("order", function ($x) use ($user) {
                 return $x->userId == $user->id;
             });
        }
        return $q->with(['order','creator'])->get()->groupBy(["orderId"]);
    }


}
