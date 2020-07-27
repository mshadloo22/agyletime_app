<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddForeignKeysToShiftRoleTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('shift_role', function(Blueprint $table)
		{
			$table->foreign('role_id')->references('id')->on('role')->onUpdate('RESTRICT')->onDelete('RESTRICT');
			$table->foreign('rostered_shift_id')->references('id')->on('rostered_shift')->onUpdate('RESTRICT')->onDelete('RESTRICT');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('shift_role', function(Blueprint $table)
		{
			$table->dropForeign('shift_role_role_id_foreign');
			$table->dropForeign('shift_role_rostered_shift_id_foreign');
		});
	}

}
