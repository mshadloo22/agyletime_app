<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddForeignKeysToShiftTasksHistoryTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('shift_tasks_history', function(Blueprint $table)
		{
			$table->foreign('created_by')->references('id')->on('user')->onUpdate('RESTRICT')->onDelete('RESTRICT');
			$table->foreign('created_event_id')->references('id')->on('shift_tasks_history')->onUpdate('RESTRICT')->onDelete('RESTRICT');
			$table->foreign('rostered_shift_history_id')->references('id')->on('rostered_shift_history')->onUpdate('RESTRICT')->onDelete('RESTRICT');
			$table->foreign('shift_tasks_id')->references('id')->on('shift_tasks')->onUpdate('RESTRICT')->onDelete('SET NULL');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('shift_tasks_history', function(Blueprint $table)
		{
			$table->dropForeign('shift_tasks_history_created_by_foreign');
			$table->dropForeign('shift_tasks_history_created_event_id_foreign');
			$table->dropForeign('shift_tasks_history_rostered_shift_history_id_foreign');
			$table->dropForeign('shift_tasks_history_shift_tasks_id_foreign');
		});
	}

}
