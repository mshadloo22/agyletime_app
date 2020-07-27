<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddForeignKeysToTimesheetShiftTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('timesheet_shift', function(Blueprint $table)
		{
			$table->foreign('timesheet_id', 'timesheet_shift_ibfk_1')->references('id')->on('timesheet')->onUpdate('RESTRICT')->onDelete('CASCADE');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('timesheet_shift', function(Blueprint $table)
		{
			$table->dropForeign('timesheet_shift_ibfk_1');
		});
	}

}
