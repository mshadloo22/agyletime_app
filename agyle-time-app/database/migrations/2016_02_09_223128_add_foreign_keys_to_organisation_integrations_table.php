<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddForeignKeysToOrganisationIntegrationsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('organisation_integrations', function(Blueprint $table)
		{
			$table->foreign('integration_id')->references('id')->on('integrations')->onUpdate('CASCADE')->onDelete('CASCADE');
			$table->foreign('organisation_id')->references('id')->on('organisation')->onUpdate('CASCADE')->onDelete('CASCADE');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('organisation_integrations', function(Blueprint $table)
		{
			$table->dropForeign('organisation_integrations_integration_id_foreign');
			$table->dropForeign('organisation_integrations_organisation_id_foreign');
		});
	}

}
