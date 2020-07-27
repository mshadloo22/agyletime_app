<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateTasksTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('tasks', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('organisation_id')->unsigned()->index('tasks_organisation_id_foreign');
			$table->string('name', 45);
			$table->string('description', 200)->nullable();
			$table->timestamps();
			$table->string('identifier');
			$table->boolean('available');
			$table->boolean('paid');
			$table->boolean('planned');
			$table->string('color', 6);
			$table->boolean('timeout');
			$table->boolean('leave');
			$table->boolean('break');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('tasks');
	}

}
