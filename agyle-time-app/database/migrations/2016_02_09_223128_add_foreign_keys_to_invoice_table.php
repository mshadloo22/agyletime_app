<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddForeignKeysToInvoiceTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('invoice', function(Blueprint $table)
		{
			$table->foreign('invoice_template_id')->references('id')->on('invoice_template')->onUpdate('RESTRICT')->onDelete('RESTRICT');
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
		Schema::table('invoice', function(Blueprint $table)
		{
			$table->dropForeign('invoice_invoice_template_id_foreign');
			$table->dropForeign('invoice_organisation_id_foreign');
		});
	}

}
