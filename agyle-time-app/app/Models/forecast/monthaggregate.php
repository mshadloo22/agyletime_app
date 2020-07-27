<?php

// Model:'MonthAggregate' - Database Table: 'month_aggregate'

/**
 * MonthAggregate
 *
 * @property integer $id
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property \Carbon\Carbon $start_time
 * @property \Carbon\Carbon $end_time
 * @property integer $volume
 * @property integer $workstream_id
 * @property integer $organisation_id
 * @property integer $total_wait_time
 * @property integer $total_handle_time
 * @property integer $grade_of_service
 * @method static \Illuminate\Database\Query\Builder|\MonthAggregate whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\MonthAggregate whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\MonthAggregate whereUpdatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\MonthAggregate whereStartTime($value)
 * @method static \Illuminate\Database\Query\Builder|\MonthAggregate whereEndTime($value)
 * @method static \Illuminate\Database\Query\Builder|\MonthAggregate whereVolume($value)
 * @method static \Illuminate\Database\Query\Builder|\MonthAggregate whereWorkstreamId($value)
 * @method static \Illuminate\Database\Query\Builder|\MonthAggregate whereOrganisationId($value)
 * @method static \Illuminate\Database\Query\Builder|\MonthAggregate whereTotalWaitTime($value)
 * @method static \Illuminate\Database\Query\Builder|\MonthAggregate whereTotalHandleTime($value)
 * @method static \Illuminate\Database\Query\Builder|\MonthAggregate whereGradeOfService($value)
 */
Class MonthAggregate extends \LaravelArdent\Ardent\Ardent
{
    protected $table='month_aggregate';

    protected $connection = 'forecast_mysql';

    protected $dates = array('start_time', 'end_time');
}