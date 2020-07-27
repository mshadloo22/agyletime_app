<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddForeignKeysToOrgIntegrationConfigTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('org_integration_config', function(Blueprint $table)
		{
			$table->foreign('organisation_integrations_id')->references('id')->on('organisation_integrations')->onUpdate('RESTRICT')->onDelete('RESTRICT');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('org_integration_config', function(Blueprint $table)
		{
			$table->dropForeign('org_integration_config_organisation_integrations_id_foreign');
		});
	}

}
