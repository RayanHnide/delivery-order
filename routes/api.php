<?php

use App\Http\Controllers\ComplainantController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use \App\Http\Controllers\CategoryController;
use \App\Http\Controllers\OrderController;
use \App\Http\Controllers\ItemController;
use \App\Http\Controllers\MessageController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('/login', [UserController::class, 'login']);
Route::post('/signup', [UserController::class, 'signup']);
Route::middleware("auth:sanctum")->group(function () {
    Route::post('logout', [UserController::class, 'logout']);

    Route::post('/add-complaint', [ComplainantController::class, 'addComplaint']);
    Route::post('/edit-status-complaint/{complaint}', [ComplainantController::class, 'updateStatus']);
    Route::get('/view-my-complaints', [ComplainantController::class, 'myComplaints']);

    Route::post('/category/add', [CategoryController::class, 'add']);
    Route::get('/category/view', [CategoryController::class, 'view']);

    Route::post('/item/add', [ItemController::class, 'add']);
    Route::get('/item/view/{categoryId}', [ItemController::class, 'view']);

    Route::post('/order/add', [OrderController::class, 'add']);
    Route::get('/view/my-orders', [OrderController::class, 'viewMyOrders']);
    Route::get('/order/{order}/details', [OrderController::class, 'viewOrderDetails']);

    Route::post('/change-status-order/{order}',[OrderController::class,'changeStatusOrder']);
    Route::middleware('role:admin')->group(function (){
        Route::get('/view-all-staff', [UserController::class, 'viewStaff']);
        Route::get('/view-all-clients', [UserController::class, 'viewClients']);
        Route::get('/view-all-users', [UserController::class, 'viewAllUsers']);
        Route::post('/employee-for-order/{order}',[OrderController::class,'addEmployeeForOrder']);
        Route::post('/add-employee', [UserController::class, 'addEmployee']);
        Route::post('/edit-user/{user}', [UserController::class, 'editUser']);
        Route::delete('/delete-user/{user}', [UserController::class, 'deleteUser']);
    });
    Route::prefix('/messages')->group(function (){
        Route::post('/send',[MessageController::class,'send']);
        Route::get('/view/my-chat',[MessageController::class,'viewMyChat']);
        Route::get('/view-messages/{user}',[MessageController::class,'view'])->middleware('role:admin');
        Route::get('/view-users-chat',[MessageController::class,'viewUsersChat'])->middleware('role:admin');
    });
});
