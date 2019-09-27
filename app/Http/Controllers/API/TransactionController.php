<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Transaction;
use App\DetailTransaction;
use Carbon\Carbon;
use App\Payment;
use DB;
use App\Http\Resources\TransactionCollection;

class TransactionController extends Controller
{
    public function index()
    {
        $search = request()->q;
        $user = request()->user();

        $transaction = Transaction::with(['user', 'detail', 'customer'])->orderBy('created_at', 'DESC')
            ->whereHas('customer', function($q) use($search) {
                $q->where('name', 'LIKE', '%' . $search . '%');
            });

        if (in_array(request()->status, [0,1])) {
            $transaction = $transaction->where('status', request()->status);
        }

        if ($user->role != 0) {
            $transaction = $transaction->where('user_id', $user->id);
        }

        $transaction = $transaction->paginate(10);
        return new TransactionCollection($transaction);
    }

    public function store(Request $request)
    {
        $this->validate($request, [
            'customer_id' => 'required',
            'detail' => 'required'
        ]);

        DB::beginTransaction();
        try {
            $user = $request->user();
            $transaction = Transaction::create([
                'customer_id' => $request->customer_id['id'],
                'user_id' => $user->id,
                'amount' => 0
            ]);

            $amount = 0;
            foreach ($request->detail as $row) {
                if (!is_null($row['laundry_price'])) {
                    $subtotal = $row['laundry_price']['price'] * $row['qty'];
                    if ($row['laundry_price']['unit_type'] == 'Kilogram') {
                        $subtotal = ($row['laundry_price']['price'] * $row['qty']) / 1000;
                    }

                    $start_date = Carbon::now();
                    $end_date = Carbon::now()->addHours($row['laundry_price']['service']);
                    if ($row['laundry_price']['service_type'] == 'Hari') {
                        $end_date = Carbon::now()->addDays($row['laundry_price']['service']);
                    }

                    DetailTransaction::create([
                        'transaction_id' => $transaction->id,
                        'laundry_price_id' => $row['laundry_price']['id'],
                        'laundry_type_id' => $row['laundry_price']['laundry_type_id'],
                        'start_date' => $start_date->format('Y-m-d H:i:s'),
                        'end_date' => $end_date->format('Y-m-d H:i:s'),
                        'qty' => $row['qty'],
                        'price' => $row['laundry_price']['price'],
                        'subtotal' => $subtotal
                    ]);

                    $amount += $subtotal;
                }
            }
            $transaction->update(['amount' => $amount]);
            DB::commit();
            return response()->json(['status' => 'success', 'data' => $transaction]);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['status' => 'error', 'data' => $e->getMessage()]);
        }
    }

    public function edit($id)
    {
        $transaction = Transaction::with(['customer', 'payment', 'detail', 'detail.product'])->find($id);
        return response()->json(['status' => 'success', 'data' => $transaction]);
    }

    public function makePayment(Request $request)
    {
        $this->validate($request, [
            'transaction_id' => 'required|exists:transactions,id',
            'amount' => 'required|integer'
        ]);

        DB::beginTransaction();
        try {
            $transaction = Transaction::with(['customer'])->find($request->transaction_id);

            $customer_change = 0;
            if ($request->via_deposit) {
                if ($transaction->customer->deposit < $request->amount) {
                    return response()->json(['status' => 'error', 'data' => 'Deposit Kurang!']);
                }
                $transaction->customer()->update(['deposit' => $transaction->customer->deposit - $request->amount]);
            } else {
                if ($request->customer_change) {
                    $customer_change = $request->amount - $transaction->amount;

                    $transaction->customer()->update(['deposit' => $transaction->customer->deposit + $customer_change]);
                }
            }

            Payment::create([
                'transaction_id' => $transaction->id,
                'amount' => $request->amount,
                'customer_change' => $customer_change,
                'type' => $request->via_deposit
            ]);
            $transaction->update(['status' => 1]);
            DB::commit();
            return response()->json(['status' => 'success']);
        } catch (\Exception $e) {
            return response()->json(['status' => 'failed', 'data' => $e->getMessage()]);
        }
    }

    public function completeItem(Request $request)
    {
        $this->validate($request, [
            'id' => 'required|exists:detail_transactions,id'
        ]);

        $transaction = DetailTransaction::with(['transaction.customer'])->find($request->id);
        $transaction->update(['status' => 1]);
        $transaction->transaction->customer()->update(['point' => $transaction->transaction->customer->point + 1]);
        return response()->json(['status' => 'success']);
    }
}
