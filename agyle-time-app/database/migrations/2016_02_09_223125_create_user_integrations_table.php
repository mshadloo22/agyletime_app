<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateUserIntegrationsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('user_integrations', function(Blueprint $table)
		{
			$table->increments('id');
			$table->timestamps();
			$table->integer('integration_id')->unsigned()->index('user_integrations_integration_id_foreign');
			$table->integer('user_id')->unsigned()->index('user_integrations_user_id_foreign');
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
		Schema::drop('user_integrations');
	}

}
