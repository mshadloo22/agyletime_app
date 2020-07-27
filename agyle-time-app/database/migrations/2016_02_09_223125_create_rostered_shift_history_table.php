<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateRosteredShiftHistoryTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('rostered_shift_history', function(Blueprint $table)
		{
			$table->increments('id');
			$table->timestamps();
			$table->integer('created_by')->unsigned()->index('rostered_shift_history_created_by_foreign');
			$table->integer('roster_id')->unsigned()->index('rostered_shift_history_roster_id_foreign');
			$table->integer('user_id')->unsigned()->index('rostered_shift_history_user_id_foreign');
			$table->integer('created_event_id')->unsigned()->nullable()->index('rostered_shift_history_created_event_id_foreign');
			$table->integer('rostered_shift_id')->unsigned()->nullable()->index('rostered_shift_history_rostered_shift_id_foreign');
			$table->date('date');
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
		Schema::drop('rostered_shift_history');
	}

}
