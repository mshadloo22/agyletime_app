<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateScheduleTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('schedule', function(Blueprint $table)
		{
			$table->increments('id');
			$table->timestamps();
			$table->integer('role_id')->unsigned()->index('schedule_role_id_foreign');
			$table->date('start_date');
			$table->date('end_date');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('schedule');
	}

}
