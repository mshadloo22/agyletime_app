<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddForeignKeysToInvoiceItemTemplateTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('invoice_item_template', function(Blueprint $table)
		{
			$table->foreign('invoice_template_id')->references('id')->on('invoice_template')->onUpdate('RESTRICT')->onDelete('RESTRICT');
			$table->foreign('team_id')->references('id')->on('team')->onUpdate('RESTRICT')->onDelete('RESTRICT');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('invoice_item_template', function(Blueprint $table)
		{
			$table->dropForeign('invoice_item_template_invoice_template_id_foreign');
			$table->dropForeign('invoice_item_template_team_id_foreign');
		});
	}

}
