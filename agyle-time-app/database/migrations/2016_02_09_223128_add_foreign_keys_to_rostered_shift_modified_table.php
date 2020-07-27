<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddForeignKeysToRosteredShiftModifiedTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('rostered_shift_modified', function(Blueprint $table)
		{
			$table->foreign('rostered_shift_id')->references('id')->on('rostered_shift')->onUpdate('RESTRICT')->onDelete('RESTRICT');
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
		Schema::table('rostered_shift_modified', function(Blueprint $table)
		{
			$table->dropForeign('rostered_shift_modified_rostered_shift_id_foreign');
			$table->dropForeign('rostered_shift_modified_user_id_foreign');
		});
	}

}
