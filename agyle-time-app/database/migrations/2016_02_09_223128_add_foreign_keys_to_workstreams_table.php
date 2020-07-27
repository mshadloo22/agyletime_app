<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddForeignKeysToWorkstreamsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('workstreams', function(Blueprint $table)
		{
			$table->foreign('forecast_method_id')->references('id')->on('forecast_method')->onUpdate('RESTRICT')->onDelete('RESTRICT');
			$table->foreign('organisation_id')->references('id')->on('organisation')->onUpdate('CASCADE')->onDelete('CASCADE');
			$table->foreign('role_id')->references('id')->on('role')->onUpdate('RESTRICT')->onDelete('RESTRICT');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('workstreams', function(Blueprint $table)
		{
			$table->dropForeign('workstreams_forecast_method_id_foreign');
			$table->dropForeign('workstreams_organisation_id_foreign');
			$table->dropForeign('workstreams_role_id_foreign');
		});
	}

}
