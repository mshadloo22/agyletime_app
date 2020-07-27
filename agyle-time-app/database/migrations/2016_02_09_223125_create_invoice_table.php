<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateInvoiceTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('invoice', function(Blueprint $table)
		{
			$table->increments('id');
			$table->timestamps();
			$table->integer('invoice_template_id')->unsigned()->index('invoice_invoice_template_id_foreign');
			$table->integer('organisation_id')->unsigned()->index('invoice_organisation_id_foreign');
			$table->date('start_date');
			$table->date('end_date');
			$table->date('issued_date');
			$table->string('reference');
			$table->string('status');
			$table->boolean('tax_included');
			$table->boolean('sent');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('invoice');
	}

}
