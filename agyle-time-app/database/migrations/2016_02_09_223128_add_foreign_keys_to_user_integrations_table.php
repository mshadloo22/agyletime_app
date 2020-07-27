<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddForeignKeysToUserIntegrationsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('user_integrations', function(Blueprint $table)
		{
			$table->foreign('integration_id')->references('id')->on('integrations')->onUpdate('CASCADE')->onDelete('CASCADE');
			$table->foreign('user_id')->references('id')->on('user')->onUpdate('CASCADE')->onDelete('CASCADE');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('user_integrations', function(Blueprint $table)
		{
			$table->dropForeign('user_integrations_integration_id_foreign');
			$table->dropForeign('user_integrations_user_id_foreign');
		});
	}

}
