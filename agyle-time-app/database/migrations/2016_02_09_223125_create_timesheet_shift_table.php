<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateTimesheetShiftTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('timesheet_shift', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('timesheet_id')->unsigned()->index('timesheet_id');
			$table->dateTime('start_time')->nullable();
			$table->dateTime('finish_time')->nullable();
			$table->string('notes', 200)->nullable();
			$table->timestamps();
			$table->float('number_of_units');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('timesheet_shift');
	}

}
