<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateShiftTasksTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('shift_tasks', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('task_id')->unsigned()->index('shift_tasks_task_id_foreign');
			$table->integer('rostered_shift_id')->unsigned()->nullable()->index('shift_tasks_rostered_shift_id_foreign');
			$table->integer('scheduled_shift_id')->unsigned()->nullable()->index('shift_tasks_scheduled_shift_id_foreign');
			$table->integer('added_by')->unsigned()->index('shift_tasks_added_by_foreign');
			$table->timestamps();
			$table->text('notes', 65535)->nullable();
			$table->dateTime('start_time')->default('0000-00-00 00:00:00');
			$table->dateTime('end_time')->default('0000-00-00 00:00:00');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('shift_tasks');
	}

}
