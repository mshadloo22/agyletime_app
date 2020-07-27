<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddForeignKeysToEmploymentRulesTemplateTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('employment_rules_template', function(Blueprint $table)
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
		Schema::table('employment_rules_template', function(Blueprint $table)
		{
			$table->dropForeign('employment_rules_template_organisation_id_foreign');
		});
	}

}
