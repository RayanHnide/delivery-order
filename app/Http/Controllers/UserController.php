<?php

namespace App\Http\Controllers;

use App\Http\Requests\AddEmployeeRequest;
use App\Http\Requests\EditEmployeeRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\UserRequest;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function login(UserRequest $request)
    {
        $data = $request->only(["phone", "password"]);
        if (!Auth::attempt($data)) {
            throw new \Exception("Wrong Phone or Password");
        }
        $user = \auth()->user();
        return ["user" => $user->toArray(),
            "token" => $user->createToken($request->ip())->plainTextToken];
    }

    public function logout()
    {
        \auth()->user()->tokens()->delete();
    }
//    public function profile(){
//        $user=\auth()->user();
//        return [...$user->toArray(),...["role"=>$user->roles()->first()->name]];
//    }
    public function signup(RegisterRequest $request)
    {
        $data = $request->only(['name', 'address', 'password', 'phone', 'photoUrl']);

        $data['password'] = Hash::make($data['password']);

        if ($request->hasFile("photoUrl")) {

            $data["photoUrl"] = $request->file('photoUrl')->store("/users", 'public');
        }
        $user = User::create($data);

        $user->syncRoles("user");

        return [
            "user" => $user->toarray(),
            "token" => $user->createToken($request->ip())->plainTextToken
        ];

    }
//    public function search($search){
//        return User::where("name","LIKE","%".$search.'%')->get();
//    }
//    public function getUser(User $user){
//        return [...$user->toArray(),...["role"=>$user->roles()->first()->name]];
//    }
    public function addEmployee(AddEmployeeRequest $request)
    {
        $data = $request->only(['name', 'phone', 'password', 'address', 'photoUrl']);
        $data['password'] = Hash::make($data['password']);
        if ($request->hasFile("photoUrl")) {
            $data['photoUrl'] = $request->file('photoUrl')->store("/users", 'public');
        }
        $user = User::create($data);
        $user->syncRoles("employee");
        return "add employee successfully";
    }

    public function editUser(User $user, EditEmployeeRequest $request)
    {
        $data = $request->only(['name', 'phone', 'address']);
        if ($request->hasFile("photoUrl")) {
            if (Storage::disk('public')->exists($user->photoUrl)) {
                Storage::delete($user->photoUrl);
            }
            $data['photoUrl'] = $request->file('photoUrl')->store("/users", 'public');
        }
        if (count($data) > 0) {
            $user->update($data);
        }
        if ($request->has("role")) {
            $user->syncRoles($request->get("role"));
        }
    }

    public function deleteUser(User $user)
    {
        return $user->delete();
    }

    public function viewStaff()
    {
        return User::query()->whereHas("roles", function ($q) {
            return $q->where("name", "employee")->orWhere("name", "admin");
        })->get();
    }

    public function viewClients()
    {
        return Role::query()->where("name", "user")->first()->users;
    }

    public function viewAllUsers() {
        return User::query()->get();
    }


}
