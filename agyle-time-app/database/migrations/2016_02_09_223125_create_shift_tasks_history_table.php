<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateShiftTasksHistoryTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('shift_tasks_history', function(Blueprint $table)
		{
			$table->increments('id');
			$table->timestamps();
			$table->integer('created_by')->unsigned()->index('shift_tasks_history_created_by_foreign');
			$table->integer('rostered_shift_history_id')->unsigned()->nullable()->index('shift_tasks_history_rostered_shift_history_id_foreign');
			$table->integer('created_event_id')->unsigned()->nullable()->index('shift_tasks_history_created_event_id_foreign');
			$table->integer('shift_tasks_id')->unsigned()->nullable()->index('shift_tasks_history_shift_tasks_id_foreign');
			$table->integer('task_id')->unsigned()->nullable();
			$table->dateTime('start_time')->default('0000-00-00 00:00:00');
			$table->dateTime('end_time')->default('0000-00-00 00:00:00');
			$table->enum('event_type', array('created','updated','deleted'));
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('shift_tasks_history');
	}

}
