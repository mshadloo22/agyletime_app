<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateUserAvailSpecTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('user_avail_spec', function(Blueprint $table)
		{
			$table->integer('user_id')->unsigned()->index('user_avail_spec_user_id_foreign');
			$table->integer('availability_specific_id')->unsigned()->index('user_avail_spec_availability_specific_id_foreign');
			$table->string('employee_notes', 500);
			$table->string('management_notes', 500)->nullable();
			$table->enum('authorized', array('submitted','approved','denied'))->default('submitted');
			$table->timestamps();
			$table->primary(['availability_specific_id','user_id']);
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('user_avail_spec');
	}

}
