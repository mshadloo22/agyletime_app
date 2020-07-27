<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddForeignKeysToTimesheetIntegrationsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('timesheet_integrations', function(Blueprint $table)
		{
			$table->foreign('integration_id')->references('id')->on('integrations')->onUpdate('CASCADE')->onDelete('CASCADE');
			$table->foreign('timesheet_id')->references('id')->on('timesheet')->onUpdate('CASCADE')->onDelete('CASCADE');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('timesheet_integrations', function(Blueprint $table)
		{
			$table->dropForeign('timesheet_integrations_integration_id_foreign');
			$table->dropForeign('timesheet_integrations_timesheet_id_foreign');
		});
	}

}
