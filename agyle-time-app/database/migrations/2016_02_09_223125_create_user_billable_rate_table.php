<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateUserBillableRateTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('user_billable_rate', function(Blueprint $table)
		{
			$table->increments('id');
			$table->timestamps();
			$table->integer('user_id')->unsigned()->index('user_billable_rate_user_id_foreign');
			$table->integer('billable_rate_id')->unsigned()->index('user_billable_rate_billable_rate_id_foreign');
			$table->date('start_date');
			$table->date('end_date')->nullable();
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('user_billable_rate');
	}

}
