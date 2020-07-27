<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddForeignKeysToOrgIntegrationConfigOptionTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('org_integration_config_option', function(Blueprint $table)
		{
			$table->foreign('org_integration_config_id')->references('id')->on('org_integration_config')->onUpdate('RESTRICT')->onDelete('RESTRICT');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('org_integration_config_option', function(Blueprint $table)
		{
			$table->dropForeign('org_integration_config_option_org_integration_config_id_foreign');
		});
	}

}
