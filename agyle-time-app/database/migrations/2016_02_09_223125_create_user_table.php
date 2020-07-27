<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateUserTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('user', function(Blueprint $table)
		{
			$table->increments('id');
			$table->string('email', 200);
			$table->string('password', 256);
			$table->string('first_name', 45)->nullable();
			$table->string('last_name', 45)->nullable();
			$table->integer('gender')->nullable()->default(0);
			$table->string('phone_one', 45)->nullable();
			$table->string('phone_two', 45)->nullable();
			$table->integer('notification_preference_id')->unsigned()->index('user_notification_preference_id_foreign');
			$table->integer('message_notification_id')->unsigned()->index('user_message_notification_id_foreign');
			$table->string('address', 200)->nullable();
			$table->string('post_code', 45)->nullable();
			$table->integer('city_id')->unsigned()->nullable()->index('user_city_id_foreign');
			$table->boolean('primary_contact')->default(0);
			$table->integer('organisation_id')->unsigned()->index('user_organisation_id_foreign');
			$table->timestamps();
			$table->string('timezone', 200);
			$table->integer('team_id')->unsigned()->nullable()->index('user_team_id_foreign');
			$table->boolean('active');
			$table->string('tour_state', 20);
			$table->string('remember_token', 100)->nullable();
			$table->integer('site_id')->unsigned()->index('user_site_id_foreign');
			$table->integer('employment_rules_template_id')->unsigned()->nullable()->index('user_employment_rules_template_id_foreign');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('user');
	}

}
