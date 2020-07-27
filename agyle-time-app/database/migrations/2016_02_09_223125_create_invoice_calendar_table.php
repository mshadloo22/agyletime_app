<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateInvoiceCalendarTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('invoice_calendar', function(Blueprint $table)
		{
			$table->increments('id');
			$table->timestamps();
			$table->dateTime('start_date')->default('0000-00-00 00:00:00');
			$table->enum('period', array('week','fortnight','four week','month'));
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('invoice_calendar');
	}

}
