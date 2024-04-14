<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AddOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "address"=>['string', 'required', 'min:5'],
            "description"=>['string'],
            "services"=>['array'],
            "services.*.itemId"=>['numeric'],
            "services.*.quantity"=>['numeric'],
            "services.*.description"=>['string'],
        ];
    }
}
