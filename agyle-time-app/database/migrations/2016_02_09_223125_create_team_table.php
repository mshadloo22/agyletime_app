<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateTeamTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('team', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('organisation_id')->unsigned()->index('team_organisation_id_foreign');
			$table->integer('team_leader_id')->unsigned()->nullable()->index('team_team_leader_id_foreign');
			$table->integer('manager_id')->unsigned()->nullable()->index('team_manager_id_foreign');
			$table->string('name', 100);
			$table->string('description', 200)->nullable();
			$table->timestamps();
			$table->softDeletes();
			$table->integer('campaign_id')->unsigned()->index('team_campaign_id_foreign');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('team');
	}

}
