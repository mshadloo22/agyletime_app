<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddForeignKeysToConfigurationConfigGroupTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('configuration_config_group', function(Blueprint $table)
		{
			$table->foreign('config_group_id')->references('id')->on('config_group')->onUpdate('RESTRICT')->onDelete('RESTRICT');
			$table->foreign('configuration_id')->references('id')->on('configuration')->onUpdate('RESTRICT')->onDelete('RESTRICT');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('configuration_config_group', function(Blueprint $table)
		{
			$table->dropForeign('configuration_config_group_config_group_id_foreign');
			$table->dropForeign('configuration_config_group_configuration_id_foreign');
		});
	}

}
