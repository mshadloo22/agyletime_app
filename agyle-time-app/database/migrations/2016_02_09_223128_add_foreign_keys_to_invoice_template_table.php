<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddForeignKeysToInvoiceTemplateTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('invoice_template', function(Blueprint $table)
		{
			$table->foreign('integration_id')->references('id')->on('integrations')->onUpdate('RESTRICT')->onDelete('RESTRICT');
			$table->foreign('invoice_calendar_id')->references('id')->on('invoice_calendar')->onUpdate('RESTRICT')->onDelete('RESTRICT');
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
		Schema::table('invoice_template', function(Blueprint $table)
		{
			$table->dropForeign('invoice_template_integration_id_foreign');
			$table->dropForeign('invoice_template_invoice_calendar_id_foreign');
			$table->dropForeign('invoice_template_organisation_id_foreign');
		});
	}

}
