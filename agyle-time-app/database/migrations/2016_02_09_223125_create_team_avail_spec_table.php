<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateTeamAvailSpecTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('team_avail_spec', function(Blueprint $table)
		{
			$table->integer('team_id')->unsigned()->index('team_avail_spec_team_id_foreign');
			$table->integer('availability_specific_id')->unsigned()->index('team_avail_spec_availability_specific_id_foreign');
			$table->string('notes', 200)->nullable();
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
		Schema::drop('team_avail_spec');
	}

}
