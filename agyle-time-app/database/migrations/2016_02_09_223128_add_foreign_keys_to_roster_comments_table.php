<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddForeignKeysToRosterCommentsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('roster_comments', function(Blueprint $table)
		{
			$table->foreign('roster_id')->references('id')->on('roster')->onUpdate('RESTRICT')->onDelete('RESTRICT');
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
		Schema::table('roster_comments', function(Blueprint $table)
		{
			$table->dropForeign('roster_comments_roster_id_foreign');
			$table->dropForeign('roster_comments_user_id_foreign');
		});
	}

}
