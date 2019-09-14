<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class DetailTransaction extends Model
{
    protected $guarded = [];
    protected $dates = ['start_date', 'end_date'];
    protected $appends = ['service_time', 'status_label'];

    public function getServiceTimeAttribute()
    {
        return $this->start_date->format('d-m-Y H:i:s') . ' s/d ' . $this->end_date->format('d-m-Y H:i:s');
    }

    public function getStatusLabelAttribute()
    {
        if ($this->status == 1) {
            return '<span class="label label-success">Selesai</span>';
        }
        return '<span class="label label-default">Proses</span>';
    }

    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }

    public function product()
    {
        return $this->belongsTo(LaundryPrice::class, 'laundry_price_id');
    }
}
