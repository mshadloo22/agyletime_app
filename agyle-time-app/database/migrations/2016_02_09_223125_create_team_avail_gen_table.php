<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateTeamAvailGenTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('team_avail_gen', function(Blueprint $table)
		{
			$table->integer('team_id')->unsigned()->index('team_avail_gen_team_id_foreign');
			$table->integer('availability_general_id')->unsigned()->index('team_avail_gen_availability_general_id_foreign');
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
		Schema::drop('team_avail_gen');
	}

}
