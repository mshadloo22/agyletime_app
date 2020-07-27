<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddForeignKeysToConfigPriorityTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('config_priority', function(Blueprint $table)
		{
			$table->foreign('configuration_id')->references('id')->on('configuration')->onUpdate('RESTRICT')->onDelete('RESTRICT');
			$table->foreign('organisation_id')->references('id')->on('organisation')->onUpdate('RESTRICT')->onDelete('RESTRICT');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('config_priority', function(Blueprint $table)
		{
			$table->dropForeign('config_priority_configuration_id_foreign');
			$table->dropForeign('config_priority_organisation_id_foreign');
		});
	}

}
