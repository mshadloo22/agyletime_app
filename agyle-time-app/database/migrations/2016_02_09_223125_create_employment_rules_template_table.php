<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateEmploymentRulesTemplateTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('employment_rules_template', function(Blueprint $table)
		{
			$table->increments('id');
			$table->timestamps();
			$table->string('name');
			$table->integer('organisation_id')->unsigned()->index('employment_rules_template_organisation_id_foreign');
			$table->float('min_shift_length')->nullable();
			$table->float('max_shift_length')->nullable();
			$table->float('min_hours_per_week')->nullable();
			$table->float('max_hours_per_week')->nullable();
			$table->float('min_time_between_breaks')->nullable();
			$table->float('max_time_between_breaks')->nullable();
			$table->float('min_shifts_per_week')->nullable();
			$table->float('max_shifts_per_week')->nullable();
			$table->float('min_time_between_shifts')->nullable();
			$table->float('saturday_pay_multiplier')->nullable();
			$table->float('sunday_pay_multiplier')->nullable();
			$table->float('overtime_pay_multiplier')->nullable();
			$table->float('hours_before_overtime_rate')->nullable();
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('employment_rules_template');
	}

}
