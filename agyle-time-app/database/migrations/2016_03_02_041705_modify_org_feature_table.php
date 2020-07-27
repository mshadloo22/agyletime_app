<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ModifyOrgFeatureTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('org_features', function (Blueprint $table) {
            //
            $table->integer('organisation_id')->unsigned()->change();
            $table->foreign('organisation_id')->references('id')->on('organisation');
            $table->integer('feature_id')->unsigned()->change();
            $table->foreign('feature_id')->references('id')->on('features');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('org_features', function (Blueprint $table) {
            //
        });
    }
}
