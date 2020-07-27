<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateConfigPriorityTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('config_priority', function(Blueprint $table)
		{
			$table->increments('id');
			$table->timestamps();
			$table->integer('priority');
			$table->string('value');
			$table->string('configurable_type');
			$table->integer('configurable_id')->unsigned();
			$table->integer('configuration_id')->unsigned()->index('config_priority_configuration_id_foreign');
			$table->integer('organisation_id')->unsigned()->index('config_priority_organisation_id_foreign');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('config_priority');
	}

}
