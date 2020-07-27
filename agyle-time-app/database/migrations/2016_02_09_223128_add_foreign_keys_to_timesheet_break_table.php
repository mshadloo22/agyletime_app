<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddForeignKeysToTimesheetBreakTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('timesheet_break', function(Blueprint $table)
		{
			$table->foreign('timesheet_shift_id', 'timesheet_break_ibfk_1')->references('id')->on('timesheet_shift')->onUpdate('RESTRICT')->onDelete('CASCADE');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('timesheet_break', function(Blueprint $table)
		{
			$table->dropForeign('timesheet_break_ibfk_1');
		});
	}

}
