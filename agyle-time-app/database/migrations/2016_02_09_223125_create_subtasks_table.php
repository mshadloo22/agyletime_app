<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateSubtasksTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('subtasks', function(Blueprint $table)
		{
			$table->increments('id');
			$table->timestamps();
			$table->integer('workstream_id')->unsigned()->index('subtasks_workstream_id_foreign');
			$table->string('name');
			$table->string('description');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('subtasks');
	}

}
