<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddForeignKeysToOrgAvailSpecTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('org_avail_spec', function(Blueprint $table)
		{
			$table->foreign('availability_specific_id')->references('id')->on('avail_specific')->onUpdate('RESTRICT')->onDelete('RESTRICT');
			$table->foreign('organisation_id')->references('id')->on('organisation')->onUpdate('RESTRICT')->onDelete('RESTRICT');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('org_avail_spec', function(Blueprint $table)
		{
			$table->dropForeign('org_avail_spec_availability_specific_id_foreign');
			$table->dropForeign('org_avail_spec_organisation_id_foreign');
		});
	}

}
