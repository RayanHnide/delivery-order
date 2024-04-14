<?php

namespace App\Http\Controllers;

use App\Events\UserMessageEvent;
use App\Http\Requests\MessageRequest;
use App\Models\Message;
use App\Models\User;

class MessageController extends Controller
{
    public function send(MessageRequest $request)
    {
        $data = $request->only(['message', 'userId']);
        $user = auth()->user();
        if ($user->hasRole("admin")) {
            $data['fromCustomer'] = false;
            $msg = Message::query()->create($data);
            event(new UserMessageEvent($msg));
            return $msg;
        }
        $data["userId"] = $user->id;
        $data['fromCustomer'] = true;
        $msg = Message::query()->create($data);
        event(new UserMessageEvent($msg));
        return $msg;
    }

    public function viewMyChat()
    {
        return Message::where('userId', auth()->user()->id)->get();
    }

    public function view(User $user)
    {
        return Message::where('userId', $user->id)->get();
    }

    public function viewUsersChat()
    {
        return Message::query()->orderBy('created_at','desc')->with('user')->get()->unique("userId");
    }

}
