<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateRosterTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('roster', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('team_id')->unsigned()->index('roster_team_id_foreign');
			$table->date('date_start');
			$table->date('date_ending');
			$table->enum('roster_stage', array('pending','submitted','approved','released','denied'))->nullable();
			$table->timestamps();
			$table->text('notes', 16777215);
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('roster');
	}

}
