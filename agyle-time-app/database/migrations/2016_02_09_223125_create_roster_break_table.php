<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateRosterBreakTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('roster_break', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('rostered_shift_id')->unsigned()->index('roster_break_rostered_shift_id_foreign');
			$table->dateTime('start_time')->nullable();
			$table->dateTime('finish_time')->nullable();
			$table->integer('break_length')->nullable();
			$table->timestamps();
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('roster_break');
	}

}
