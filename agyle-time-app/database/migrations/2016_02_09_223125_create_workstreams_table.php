<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateWorkstreamsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('workstreams', function(Blueprint $table)
		{
			$table->increments('id');
			$table->timestamps();
			$table->string('name');
			$table->string('description');
			$table->integer('role_id')->unsigned()->nullable()->index('workstreams_role_id_foreign');
			$table->integer('organisation_id')->unsigned()->index('workstreams_organisation_id_foreign');
			$table->string('color', 6);
			$table->integer('wait_time_threshold');
			$table->integer('grade_of_service');
			$table->integer('aht_goal')->unsigned()->default(0);
			$table->integer('abandon_threshold')->unsigned()->default(0);
			$table->integer('forecast_method_id')->unsigned()->default(1)->index('workstreams_forecast_method_id_foreign');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('workstreams');
	}

}
