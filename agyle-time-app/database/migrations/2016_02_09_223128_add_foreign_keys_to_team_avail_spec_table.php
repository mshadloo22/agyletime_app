<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddForeignKeysToTeamAvailSpecTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('team_avail_spec', function(Blueprint $table)
		{
			$table->foreign('availability_specific_id')->references('id')->on('avail_specific')->onUpdate('RESTRICT')->onDelete('RESTRICT');
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
		Schema::table('team_avail_spec', function(Blueprint $table)
		{
			$table->dropForeign('team_avail_spec_availability_specific_id_foreign');
			$table->dropForeign('team_avail_spec_team_id_foreign');
		});
	}

}
