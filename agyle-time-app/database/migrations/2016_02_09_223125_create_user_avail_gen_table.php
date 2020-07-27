<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateUserAvailGenTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('user_avail_gen', function(Blueprint $table)
		{
			$table->integer('user_id')->unsigned()->index('user_avail_gen_user_id_foreign');
			$table->integer('availability_general_id')->unsigned()->index('user_avail_gen_availability_general_id_foreign');
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
		Schema::drop('user_avail_gen');
	}

}
