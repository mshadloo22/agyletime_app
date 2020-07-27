<?php

// Model:'HourAggregate' - Database Table: 'hour_aggregate'

/**
 * HourAggregate
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
 * @method static \Illuminate\Database\Query\Builder|\HourAggregate whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\HourAggregate whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\HourAggregate whereUpdatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\HourAggregate whereStartTime($value)
 * @method static \Illuminate\Database\Query\Builder|\HourAggregate whereEndTime($value)
 * @method static \Illuminate\Database\Query\Builder|\HourAggregate whereVolume($value)
 * @method static \Illuminate\Database\Query\Builder|\HourAggregate whereWorkstreamId($value)
 * @method static \Illuminate\Database\Query\Builder|\HourAggregate whereOrganisationId($value)
 * @method static \Illuminate\Database\Query\Builder|\HourAggregate whereTotalWaitTime($value)
 * @method static \Illuminate\Database\Query\Builder|\HourAggregate whereTotalHandleTime($value)
 * @method static \Illuminate\Database\Query\Builder|\HourAggregate whereGradeOfService($value)
 */
Class HourAggregate extends \LaravelArdent\Ardent\Ardent
{
    protected $table='hour_aggregate';

    protected $connection = 'forecast_mysql';

    protected $dates = array('start_time', 'end_time');
}