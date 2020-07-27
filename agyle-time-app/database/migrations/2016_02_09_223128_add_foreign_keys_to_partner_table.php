<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddForeignKeysToPartnerTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('partner', function(Blueprint $table)
		{
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
		Schema::table('partner', function(Blueprint $table)
		{
			$table->dropForeign('partner_organisation_id_foreign');
		});
	}

}
