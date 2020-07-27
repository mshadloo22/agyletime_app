<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateInvoiceTemplateTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('invoice_template', function(Blueprint $table)
		{
			$table->increments('id');
			$table->timestamps();
			$table->integer('invoice_calendar_id')->unsigned()->index('invoice_template_invoice_calendar_id_foreign');
			$table->integer('organisation_id')->unsigned()->index('invoice_template_organisation_id_foreign');
			$table->integer('integration_id')->unsigned()->index('invoice_template_integration_id_foreign');
			$table->string('branding_theme');
			$table->string('contact');
			$table->boolean('tax_included');
			$table->string('reference_template');
			$table->enum('status', array('draft','pending approval','approved'));
			$table->string('name');
			$table->integer('issued_date_offset');
			$table->dateTime('next_run_date')->default('0000-00-00 00:00:00');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('invoice_template');
	}

}
