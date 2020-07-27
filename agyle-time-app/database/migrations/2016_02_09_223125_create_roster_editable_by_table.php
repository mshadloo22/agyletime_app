<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateRosterEditableByTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('roster_editable_by', function(Blueprint $table)
		{
			$table->integer('user_id')->unsigned()->index('roster_editable_by_user_id_foreign');
			$table->integer('roster_id')->unsigned()->index('roster_editable_by_roster_id_foreign');
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
		Schema::drop('roster_editable_by');
	}

}
