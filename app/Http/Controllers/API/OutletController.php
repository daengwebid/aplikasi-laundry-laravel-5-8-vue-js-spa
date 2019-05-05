<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\OutletCollection;
use App\Outlet;

class OutletController extends Controller
{
    public function index()
    {
        $outlets = Outlet::orderBy('created_at', 'DESC');
        if (request()->q != '') {
            $outlets = $outlets->where('name', 'LIKE', '%' . request()->q . '%');
        }
        return new OutletCollection($outlets->paginate(10));
    }

    public function store(Request $request)
    {
        $this->validate($request, [
            'code' => 'required|unique:outlets,code',
            'name' => 'required|string|max:100',
            'address' => 'required|string',
            'phone' => 'required|max:13'
        ]);

        Outlet::create($request->all());
        return response()->json(['status' => 'success'], 200);
    }

    public function edit($id)
    {
        $outlet = Outlet::whereCode($id)->first();
        return response()->json(['status' => 'success', 'data' => $outlet], 200);
    }

    public function update(Request $request, $id)
    {
        $this->validate($request, [
            'code' => 'required|exists:outlets,code',
            'name' => 'required|string|max:100',
            'address' => 'required|string',
            'phone' => 'required|max:13'
        ]);

        $outlet = Outlet::whereCode($id)->first();
        $outlet->update($request->except('code'));
        return response()->json(['status' => 'success'], 200);
    }

    public function destroy($id)
    {
        $outlet = Outlet::find($id);
        $outlet->delete();
        return response()->json(['status' => 'success'], 200);
    }
}
