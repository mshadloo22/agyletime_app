<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateTimesheetTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('timesheet', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('user_id')->unsigned()->index('timesheet_user_id_foreign');
			$table->enum('approval_stage', array('not submitted','submitted','approved','denied','canceled','unopened'));
			$table->date('date_start');
			$table->date('date_end');
			$table->timestamps();
			$table->string('notes', 500)->nullable();
			$table->boolean('user_worked')->default(1);
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('timesheet');
	}

}
