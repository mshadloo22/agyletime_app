<?php

// Model:'DayAggregate' - Database Table: 'day_aggregate'

/**
 * DayAggregate
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
 * @method static \Illuminate\Database\Query\Builder|\DayAggregate whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\DayAggregate whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\DayAggregate whereUpdatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\DayAggregate whereStartTime($value)
 * @method static \Illuminate\Database\Query\Builder|\DayAggregate whereEndTime($value)
 * @method static \Illuminate\Database\Query\Builder|\DayAggregate whereVolume($value)
 * @method static \Illuminate\Database\Query\Builder|\DayAggregate whereWorkstreamId($value)
 * @method static \Illuminate\Database\Query\Builder|\DayAggregate whereOrganisationId($value)
 * @method static \Illuminate\Database\Query\Builder|\DayAggregate whereTotalWaitTime($value)
 * @method static \Illuminate\Database\Query\Builder|\DayAggregate whereTotalHandleTime($value)
 * @method static \Illuminate\Database\Query\Builder|\DayAggregate whereGradeOfService($value)
 */
Class DayAggregate extends \LaravelArdent\Ardent\Ardent
{
    protected $table='day_aggregate';

    protected $connection = 'forecast_mysql';

    protected $dates = array('start_time', 'end_time');
}