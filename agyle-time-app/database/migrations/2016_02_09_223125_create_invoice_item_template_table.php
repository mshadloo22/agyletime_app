<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateInvoiceItemTemplateTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('invoice_item_template', function(Blueprint $table)
		{
			$table->increments('id');
			$table->timestamps();
			$table->integer('team_id')->unsigned()->index('invoice_item_template_team_id_foreign');
			$table->integer('invoice_template_id')->unsigned()->index('invoice_item_template_invoice_template_id_foreign');
			$table->string('account');
			$table->string('tracking');
			$table->string('description_template');
			$table->string('tax_rate')->nullable();
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('invoice_item_template');
	}

}
