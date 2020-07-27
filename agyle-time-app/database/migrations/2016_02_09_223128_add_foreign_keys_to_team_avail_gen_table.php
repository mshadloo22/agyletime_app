<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddForeignKeysToTeamAvailGenTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('team_avail_gen', function(Blueprint $table)
		{
			$table->foreign('availability_general_id')->references('id')->on('avail_general')->onUpdate('RESTRICT')->onDelete('RESTRICT');
			$table->foreign('team_id')->references('id')->on('team')->onUpdate('RESTRICT')->onDelete('RESTRICT');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('team_avail_gen', function(Blueprint $table)
		{
			$table->dropForeign('team_avail_gen_availability_general_id_foreign');
			$table->dropForeign('team_avail_gen_team_id_foreign');
		});
	}

}
