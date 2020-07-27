<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateAdherenceExceptionTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('adherence_exception', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('rostered_shift_id')->unsigned()->index('adherence_exception_rostered_shift_id_foreign');
			$table->timestamps();
			$table->dateTime('start_time')->default('0000-00-00 00:00:00');
			$table->dateTime('end_time')->default('0000-00-00 00:00:00');
			$table->string('notes');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('adherence_exception');
	}

}
