<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateOrgIntegrationConfigOptionTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('org_integration_config_option', function(Blueprint $table)
		{
			$table->increments('id');
			$table->timestamps();
			$table->integer('org_integration_config_id')->unsigned()->index('org_integration_config_option_org_integration_config_id_foreign');
			$table->string('identifier');
			$table->string('option', 20000);
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('org_integration_config_option');
	}

}
