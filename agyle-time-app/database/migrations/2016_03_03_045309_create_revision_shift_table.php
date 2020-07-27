<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRevisionShiftTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('revision_shifts', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            //Rostered_Shift
            $table->integer('roster_id')->unsigned()->nullable();
            $table->integer('shift_id')->unsigned()->nullable();
            $table->integer('old_user_id')->unsigned()->nullable();
            $table->foreign('old_user_id')->references('id')->on('user');
            $table->date('old_date')->nullable();
            $table->dateTime('old_start_time')->nullable();
            $table->dateTime('old_end_time')->nullable();
            $table->integer('new_user_id')->unsigned()->nullable();
            $table->foreign('new_user_id')->references('id')->on('user');
            $table->date('new_date')->nullable();
            $table->dateTime('new_start_time')->nullable();
            $table->dateTime('new_end_time')->nullable();
            //Shift_Task
            $table->integer('shift_task_id')->unsigned()->nullable();
            $table->integer('task_id')->unsigned()->nullable();
            $table->foreign('task_id')->references('id')->on('tasks');

            $table->dateTime('old_shift_task_start_time')->nullable();
            $table->dateTime('old_shift_task_end_time')->nullable();
            $table->dateTime('new_shift_task_start_time')->nullable();
            $table->dateTime('new_shift_task_end_time')->nullable();
            //Revision
            $table->integer('revision_id')->unsigned();
            $table->foreign('revision_id')->references('id')->on('revisions');
            $table->integer('status');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('revision_shifts');
    }
}
