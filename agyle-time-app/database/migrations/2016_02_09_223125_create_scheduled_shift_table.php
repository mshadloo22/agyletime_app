<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateScheduledShiftTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('scheduled_shift', function(Blueprint $table)
		{
			$table->increments('id');
			$table->timestamps();
			$table->integer('schedule_id')->unsigned()->index('scheduled_shift_schedule_id_foreign');
			$table->integer('rostered_shift_id')->unsigned()->nullable()->index('scheduled_shift_rostered_shift_id_foreign');
			$table->date('date');
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
		Schema::drop('scheduled_shift');
	}

}
