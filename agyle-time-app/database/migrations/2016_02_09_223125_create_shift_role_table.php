<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateShiftRoleTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('shift_role', function(Blueprint $table)
		{
			$table->integer('role_id')->unsigned()->index('shift_role_role_id_foreign');
			$table->integer('rostered_shift_id')->unsigned()->index('shift_role_rostered_shift_id_foreign');
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
		Schema::drop('shift_role');
	}

}
