<?php

// Model:'QuarterHourAggregate' - Database Table: 'quarter_hour_aggregate'

/**
 * QuarterHourAggregate
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
 * @method static \Illuminate\Database\Query\Builder|\QuarterHourAggregate whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\QuarterHourAggregate whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\QuarterHourAggregate whereUpdatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\QuarterHourAggregate whereStartTime($value)
 * @method static \Illuminate\Database\Query\Builder|\QuarterHourAggregate whereEndTime($value)
 * @method static \Illuminate\Database\Query\Builder|\QuarterHourAggregate whereVolume($value)
 * @method static \Illuminate\Database\Query\Builder|\QuarterHourAggregate whereWorkstreamId($value)
 * @method static \Illuminate\Database\Query\Builder|\QuarterHourAggregate whereOrganisationId($value)
 * @method static \Illuminate\Database\Query\Builder|\QuarterHourAggregate whereTotalWaitTime($value)
 * @method static \Illuminate\Database\Query\Builder|\QuarterHourAggregate whereTotalHandleTime($value)
 * @method static \Illuminate\Database\Query\Builder|\QuarterHourAggregate whereGradeOfService($value)
 */
Class QuarterHourAggregate extends \LaravelArdent\Ardent\Ardent
{
    protected $table='quarter_hour_aggregate';

    protected $connection = 'forecast_mysql';

    protected $dates = array('start_time', 'end_time');
}