<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateRosteredShiftTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('rostered_shift', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('roster_id')->unsigned()->index('rostered_shift_roster_id_foreign');
			$table->integer('user_id')->unsigned()->index('rostered_shift_user_id_foreign');
			$table->date('date');
			$table->dateTime('rostered_start_time')->default('0000-00-00 00:00:00');
			$table->dateTime('rostered_end_time')->default('0000-00-00 00:00:00');
			$table->dateTime('start_time')->nullable();
			$table->dateTime('end_time')->nullable();
			$table->string('notes', 200)->nullable();
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
		Schema::drop('rostered_shift');
	}

}
