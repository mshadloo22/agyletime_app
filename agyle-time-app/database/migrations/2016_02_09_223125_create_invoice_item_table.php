<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateInvoiceItemTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('invoice_item', function(Blueprint $table)
		{
			$table->increments('id');
			$table->timestamps();
			$table->integer('invoice_id')->unsigned()->index('invoice_item_invoice_id_foreign');
			$table->integer('user_id')->unsigned()->index('invoice_item_user_id_foreign');
			$table->integer('billable_rate_id')->unsigned()->index('invoice_item_billable_rate_id_foreign');
			$table->integer('invoice_item_template_id')->unsigned()->index('invoice_item_invoice_item_template_id_foreign');
			$table->float('quantity');
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
		Schema::drop('invoice_item');
	}

}
