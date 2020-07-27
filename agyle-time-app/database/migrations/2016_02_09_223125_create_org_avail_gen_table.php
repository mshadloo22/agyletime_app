<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateOrgAvailGenTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('org_avail_gen', function(Blueprint $table)
		{
			$table->integer('organisation_id')->unsigned()->index('org_avail_gen_organisation_id_foreign');
			$table->integer('availability_general_id')->unsigned()->index('org_avail_gen_availability_general_id_foreign');
			$table->timestamps();
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('org_avail_gen');
	}

}
