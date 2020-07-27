<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateSiteTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('site', function(Blueprint $table)
		{
			$table->increments('id');
			$table->timestamps();
			$table->string('name');
			$table->string('description');
			$table->integer('organisation_id')->unsigned()->index('site_organisation_id_foreign');
			$table->string('address', 200)->nullable();
			$table->string('post_code', 45)->nullable();
			$table->integer('city_id')->unsigned()->index('site_city_id_foreign');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('site');
	}

}
