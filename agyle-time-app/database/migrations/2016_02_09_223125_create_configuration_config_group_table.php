<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateConfigurationConfigGroupTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('configuration_config_group', function(Blueprint $table)
		{
			$table->increments('id');
			$table->timestamps();
			$table->integer('configuration_id')->unsigned()->index('configuration_config_group_configuration_id_foreign');
			$table->integer('config_group_id')->unsigned()->index('configuration_config_group_config_group_id_foreign');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('configuration_config_group');
	}

}
