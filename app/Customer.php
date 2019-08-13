<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected $guarded = [];

    public function courier()
    {
        return $this->belongsTo(User::class);
    }
}
