<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddForeignKeysToInvoiceItemTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('invoice_item', function(Blueprint $table)
		{
			$table->foreign('billable_rate_id')->references('id')->on('billable_rate')->onUpdate('RESTRICT')->onDelete('RESTRICT');
			$table->foreign('invoice_id')->references('id')->on('invoice')->onUpdate('RESTRICT')->onDelete('RESTRICT');
			$table->foreign('invoice_item_template_id')->references('id')->on('invoice_item_template')->onUpdate('RESTRICT')->onDelete('RESTRICT');
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
		Schema::table('invoice_item', function(Blueprint $table)
		{
			$table->dropForeign('invoice_item_billable_rate_id_foreign');
			$table->dropForeign('invoice_item_invoice_id_foreign');
			$table->dropForeign('invoice_item_invoice_item_template_id_foreign');
			$table->dropForeign('invoice_item_user_id_foreign');
		});
	}

}
