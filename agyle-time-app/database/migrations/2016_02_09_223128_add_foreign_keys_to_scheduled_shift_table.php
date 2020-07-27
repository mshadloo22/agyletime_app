<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddForeignKeysToScheduledShiftTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('scheduled_shift', function(Blueprint $table)
		{
			$table->foreign('rostered_shift_id')->references('id')->on('rostered_shift')->onUpdate('RESTRICT')->onDelete('RESTRICT');
			$table->foreign('schedule_id')->references('id')->on('schedule')->onUpdate('RESTRICT')->onDelete('RESTRICT');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('scheduled_shift', function(Blueprint $table)
		{
			$table->dropForeign('scheduled_shift_rostered_shift_id_foreign');
			$table->dropForeign('scheduled_shift_schedule_id_foreign');
		});
	}

}
