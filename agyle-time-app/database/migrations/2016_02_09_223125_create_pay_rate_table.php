<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreatePayRateTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('pay_rate', function(Blueprint $table)
		{
			$table->increments('id');
			$table->float('pay_rate');
			$table->string('description', 200)->nullable();
			$table->timestamps();
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
		Schema::drop('pay_rate');
	}

}
