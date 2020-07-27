<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddForeignKeysToUserBillableRateTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('user_billable_rate', function(Blueprint $table)
		{
			$table->foreign('billable_rate_id')->references('id')->on('billable_rate')->onUpdate('RESTRICT')->onDelete('RESTRICT');
			$table->foreign('user_id')->references('id')->on('user')->onUpdate('RESTRICT')->onDelete('RESTRICT');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('user_billable_rate', function(Blueprint $table)
		{
			$table->dropForeign('user_billable_rate_billable_rate_id_foreign');
			$table->dropForeign('user_billable_rate_user_id_foreign');
		});
	}

}
