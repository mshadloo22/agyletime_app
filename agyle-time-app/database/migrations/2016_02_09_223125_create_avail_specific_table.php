<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateAvailSpecificTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('avail_specific', function(Blueprint $table)
		{
			$table->increments('id');
			$table->date('start_date');
			$table->date('end_date');
			$table->time('start_time')->nullable();
			$table->time('end_time')->nullable();
			$table->boolean('all_day');
			$table->boolean('is_available');
			$table->timestamps();
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('avail_specific');
	}

}
