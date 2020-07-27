<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddForeignKeysToOrgAvailGenTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('org_avail_gen', function(Blueprint $table)
		{
			$table->foreign('availability_general_id')->references('id')->on('avail_general')->onUpdate('RESTRICT')->onDelete('RESTRICT');
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
		Schema::table('org_avail_gen', function(Blueprint $table)
		{
			$table->dropForeign('org_avail_gen_availability_general_id_foreign');
			$table->dropForeign('org_avail_gen_organisation_id_foreign');
		});
	}

}
