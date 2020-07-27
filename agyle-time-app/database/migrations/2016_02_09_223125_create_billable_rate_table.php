<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateBillableRateTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('billable_rate', function(Blueprint $table)
		{
			$table->increments('id');
			$table->timestamps();
			$table->float('billable_rate');
			$table->string('description', 200)->nullable();
			$table->enum('unit_type', array('hour','day'))->default('hour');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('billable_rate');
	}

}
