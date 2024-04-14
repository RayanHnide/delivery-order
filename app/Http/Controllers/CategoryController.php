<?php

namespace App\Http\Controllers;

use App\Http\Requests\AddCategoryRequest;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CategoryController extends Controller
{
    public function add(AddCategoryRequest $request){
        $data =$request->only('name','photo');
        $data['photoUrl']=Storage::disk('public')->put('/category',$data['photo']);
        Category::create($data);
    }

    public function view(){
        return Category::all();
    }
}
