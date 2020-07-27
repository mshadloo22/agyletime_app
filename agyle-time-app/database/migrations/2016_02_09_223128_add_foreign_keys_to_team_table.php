<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddForeignKeysToTeamTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('team', function(Blueprint $table)
		{
			$table->foreign('campaign_id')->references('id')->on('campaign')->onUpdate('RESTRICT')->onDelete('RESTRICT');
			$table->foreign('manager_id')->references('id')->on('user')->onUpdate('RESTRICT')->onDelete('RESTRICT');
			$table->foreign('organisation_id')->references('id')->on('organisation')->onUpdate('RESTRICT')->onDelete('RESTRICT');
			$table->foreign('team_leader_id')->references('id')->on('user')->onUpdate('RESTRICT')->onDelete('RESTRICT');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('team', function(Blueprint $table)
		{
			$table->dropForeign('team_campaign_id_foreign');
			$table->dropForeign('team_manager_id_foreign');
			$table->dropForeign('team_organisation_id_foreign');
			$table->dropForeign('team_team_leader_id_foreign');
		});
	}

}
