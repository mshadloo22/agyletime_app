<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddForeignKeysToSubtasksTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('subtasks', function(Blueprint $table)
		{
			$table->foreign('workstream_id')->references('id')->on('workstreams')->onUpdate('CASCADE')->onDelete('CASCADE');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('subtasks', function(Blueprint $table)
		{
			$table->dropForeign('subtasks_workstream_id_foreign');
		});
	}

}
