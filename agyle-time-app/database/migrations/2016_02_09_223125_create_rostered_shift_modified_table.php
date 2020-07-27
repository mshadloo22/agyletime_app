<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateRosteredShiftModifiedTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('rostered_shift_modified', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('rostered_shift_id')->unsigned()->index('rostered_shift_modified_rostered_shift_id_foreign');
			$table->integer('user_id')->unsigned()->index('rostered_shift_modified_user_id_foreign');
			$table->text('event_details', 65535);
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
		Schema::drop('rostered_shift_modified');
	}

}
