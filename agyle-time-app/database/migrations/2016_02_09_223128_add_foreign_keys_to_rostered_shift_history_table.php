<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddForeignKeysToRosteredShiftHistoryTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('rostered_shift_history', function(Blueprint $table)
		{
			$table->foreign('created_by')->references('id')->on('user')->onUpdate('RESTRICT')->onDelete('RESTRICT');
			$table->foreign('created_event_id')->references('id')->on('rostered_shift_history')->onUpdate('RESTRICT')->onDelete('RESTRICT');
			$table->foreign('roster_id')->references('id')->on('roster')->onUpdate('RESTRICT')->onDelete('RESTRICT');
			$table->foreign('rostered_shift_id')->references('id')->on('rostered_shift')->onUpdate('RESTRICT')->onDelete('SET NULL');
			$table->foreign('user_id')->references('id')->on('user')->onUpdate('RESTRICT')->onDelete('RESTRICT');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('rostered_shift_history', function(Blueprint $table)
		{
			$table->dropForeign('rostered_shift_history_created_by_foreign');
			$table->dropForeign('rostered_shift_history_created_event_id_foreign');
			$table->dropForeign('rostered_shift_history_roster_id_foreign');
			$table->dropForeign('rostered_shift_history_rostered_shift_id_foreign');
			$table->dropForeign('rostered_shift_history_user_id_foreign');
		});
	}

}
