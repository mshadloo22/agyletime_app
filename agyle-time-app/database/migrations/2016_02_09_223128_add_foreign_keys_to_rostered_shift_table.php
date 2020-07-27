<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddForeignKeysToRosteredShiftTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('rostered_shift', function(Blueprint $table)
		{
			$table->foreign('roster_id')->references('id')->on('roster')->onUpdate('RESTRICT')->onDelete('RESTRICT');
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
		Schema::table('rostered_shift', function(Blueprint $table)
		{
			$table->dropForeign('rostered_shift_roster_id_foreign');
			$table->dropForeign('rostered_shift_user_id_foreign');
		});
	}

}
