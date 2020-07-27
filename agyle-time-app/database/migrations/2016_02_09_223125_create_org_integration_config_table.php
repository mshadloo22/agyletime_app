<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateOrgIntegrationConfigTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('org_integration_config', function(Blueprint $table)
		{
			$table->increments('id');
			$table->timestamps();
			$table->integer('organisation_integrations_id')->unsigned()->index('org_integration_config_organisation_integrations_id_foreign');
			$table->string('option_key');
			$table->string('value')->nullable();
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('org_integration_config');
	}

}
