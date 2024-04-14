<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles=[
            "admin",
            "employee",
            "user"
        ];
        foreach ($roles as $role){
            Role::create(["name"=>$role]);
        }
        $admin=User::create([
            "name"=>'admin',
            "password"=>Hash::make("123123"),
            "phone"=>"0993782136",
        ]);
        $admin->syncRoles('admin');

    }
}
