<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateOrganisationTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('organisation', function(Blueprint $table)
		{
			$table->increments('id');
			$table->string('name', 100)->nullable();
			$table->string('business_registration', 45)->nullable();
			$table->string('address', 200)->nullable();
			$table->string('post_code', 45)->nullable();
			$table->integer('city_id')->unsigned()->nullable()->index('organisation_city_id_foreign');
			$table->string('phone', 45)->nullable();
			$table->string('email', 45)->nullable();
			$table->integer('plan_id')->unsigned()->index('organisation_plan_id_foreign');
			$table->integer('payment_info_id')->unsigned()->index('organisation_payment_info_id_foreign');
			$table->timestamps();
			$table->string('api_token', 128);
			$table->string('subdomain', 50);
			$table->boolean('setup_wizard_complete')->default(0);
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('organisation');
	}

}
