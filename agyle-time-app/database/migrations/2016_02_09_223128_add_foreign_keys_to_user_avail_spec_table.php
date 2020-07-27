<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddForeignKeysToUserAvailSpecTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('user_avail_spec', function(Blueprint $table)
		{
			$table->foreign('availability_specific_id')->references('id')->on('avail_specific')->onUpdate('RESTRICT')->onDelete('RESTRICT');
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
		Schema::table('user_avail_spec', function(Blueprint $table)
		{
			$table->dropForeign('user_avail_spec_availability_specific_id_foreign');
			$table->dropForeign('user_avail_spec_user_id_foreign');
		});
	}

}
