<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddForeignKeysToOrganisationTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('organisation', function(Blueprint $table)
		{
			$table->foreign('city_id')->references('id')->on('city')->onUpdate('RESTRICT')->onDelete('RESTRICT');
			$table->foreign('payment_info_id')->references('id')->on('plan')->onUpdate('RESTRICT')->onDelete('RESTRICT');
			$table->foreign('plan_id')->references('id')->on('payment_info')->onUpdate('RESTRICT')->onDelete('RESTRICT');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('organisation', function(Blueprint $table)
		{
			$table->dropForeign('organisation_city_id_foreign');
			$table->dropForeign('organisation_payment_info_id_foreign');
			$table->dropForeign('organisation_plan_id_foreign');
		});
	}

}
