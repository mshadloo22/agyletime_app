<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateAvailGeneralTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('avail_general', function(Blueprint $table)
		{
			$table->increments('id');
			$table->enum('day', array('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'));
			$table->time('start_time')->default('00:00:00');
			$table->time('end_time')->default('00:00:00');
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
		Schema::drop('avail_general');
	}

}
