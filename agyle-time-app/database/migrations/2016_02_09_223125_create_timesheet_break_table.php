<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateTimesheetBreakTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('timesheet_break', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('timesheet_shift_id')->unsigned()->index('timesheet_shift_id');
			$table->dateTime('start_time')->nullable();
			$table->dateTime('finish_time')->nullable();
			$table->integer('break_length');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('timesheet_break');
	}

}
