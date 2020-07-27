<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateOrgAvailSpecTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('org_avail_spec', function(Blueprint $table)
		{
			$table->integer('organisation_id')->unsigned()->index('org_avail_spec_organisation_id_foreign');
			$table->integer('availability_specific_id')->unsigned()->index('org_avail_spec_availability_specific_id_foreign');
			$table->string('notes', 200);
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
		Schema::drop('org_avail_spec');
	}

}
