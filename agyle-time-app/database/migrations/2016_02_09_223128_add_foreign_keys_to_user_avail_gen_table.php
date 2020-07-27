<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddForeignKeysToUserAvailGenTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('user_avail_gen', function(Blueprint $table)
		{
			$table->foreign('availability_general_id')->references('id')->on('avail_general')->onUpdate('RESTRICT')->onDelete('RESTRICT');
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
		Schema::table('user_avail_gen', function(Blueprint $table)
		{
			$table->dropForeign('user_avail_gen_availability_general_id_foreign');
			$table->dropForeign('user_avail_gen_user_id_foreign');
		});
	}

}
