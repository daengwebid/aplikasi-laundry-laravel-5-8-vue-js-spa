<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateLaundryPricesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('laundry_prices', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name');
            $table->string('unit_type');
            $table->unsignedBigInteger('laundry_type_id');
            $table->integer('price');
            $table->unsignedBigInteger('user_id');
            $table->timestamps();

            $table->foreign('laundry_type_id')->references('id')->on('laundry_types');
            $table->foreign('user_id')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('laundry_prices');
    }
}
