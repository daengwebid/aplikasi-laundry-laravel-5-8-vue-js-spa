<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddTimeToLaundryPricesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('laundry_prices', function (Blueprint $table) {
            $table->char('service', 5)->nullable()->after('price');
            $table->string('service_type')->nullable()->after('service');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('laundry_prices', function (Blueprint $table) {
            $table->dropColumn('service');
            $table->dropColumn('service_type');
        });
    }
}
