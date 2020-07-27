<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateTimesheetIntegrationsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('timesheet_integrations', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('integration_id')->unsigned()->index('timesheet_integrations_integration_id_foreign');
			$table->integer('timesheet_id')->unsigned()->index('timesheet_integrations_timesheet_id_foreign');
			$table->boolean('sent');
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
		Schema::drop('timesheet_integrations');
	}

}
