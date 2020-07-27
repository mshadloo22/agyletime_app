<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddForeignKeysToShiftTasksTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('shift_tasks', function(Blueprint $table)
		{
			$table->foreign('added_by')->references('id')->on('user')->onUpdate('RESTRICT')->onDelete('RESTRICT');
			$table->foreign('rostered_shift_id')->references('id')->on('rostered_shift')->onUpdate('RESTRICT')->onDelete('RESTRICT');
			$table->foreign('scheduled_shift_id')->references('id')->on('scheduled_shift')->onUpdate('RESTRICT')->onDelete('RESTRICT');
			$table->foreign('task_id')->references('id')->on('tasks')->onUpdate('RESTRICT')->onDelete('RESTRICT');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('shift_tasks', function(Blueprint $table)
		{
			$table->dropForeign('shift_tasks_added_by_foreign');
			$table->dropForeign('shift_tasks_rostered_shift_id_foreign');
			$table->dropForeign('shift_tasks_scheduled_shift_id_foreign');
			$table->dropForeign('shift_tasks_task_id_foreign');
		});
	}

}
