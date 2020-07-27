<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddForeignKeysToUserTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('user', function(Blueprint $table)
		{
			$table->foreign('city_id')->references('id')->on('city')->onUpdate('RESTRICT')->onDelete('RESTRICT');
			$table->foreign('employment_rules_template_id')->references('id')->on('employment_rules_template')->onUpdate('RESTRICT')->onDelete('RESTRICT');
			$table->foreign('message_notification_id')->references('id')->on('message_notification_preference')->onUpdate('RESTRICT')->onDelete('RESTRICT');
			$table->foreign('notification_preference_id')->references('id')->on('notification_preference')->onUpdate('RESTRICT')->onDelete('RESTRICT');
			$table->foreign('organisation_id')->references('id')->on('organisation')->onUpdate('RESTRICT')->onDelete('RESTRICT');
			$table->foreign('site_id')->references('id')->on('site')->onUpdate('RESTRICT')->onDelete('RESTRICT');
			$table->foreign('team_id')->references('id')->on('team')->onUpdate('RESTRICT')->onDelete('RESTRICT');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('user', function(Blueprint $table)
		{
			$table->dropForeign('user_city_id_foreign');
			$table->dropForeign('user_employment_rules_template_id_foreign');
			$table->dropForeign('user_message_notification_id_foreign');
			$table->dropForeign('user_notification_preference_id_foreign');
			$table->dropForeign('user_organisation_id_foreign');
			$table->dropForeign('user_site_id_foreign');
			$table->dropForeign('user_team_id_foreign');
		});
	}

}
