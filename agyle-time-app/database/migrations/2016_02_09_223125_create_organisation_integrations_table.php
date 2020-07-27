<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateOrganisationIntegrationsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('organisation_integrations', function(Blueprint $table)
		{
			$table->increments('id');
			$table->timestamps();
			$table->integer('integration_id')->unsigned()->index('organisation_integrations_integration_id_foreign');
			$table->integer('organisation_id')->unsigned()->index('organisation_integrations_organisation_id_foreign');
			$table->text('configuration');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('organisation_integrations');
	}

}
