<?php

// Model:'MonthForecast' - Database Table: 'month_forecasts'

/**
 * MonthForecast
 *
 * @property integer $id
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property \Carbon\Carbon $prediction_start_time
 * @property \Carbon\Carbon $prediction_end_time
 * @property integer $workstream_id
 * @property integer $organisation_id
 * @property integer $method_id
 * @property integer $accuracy_delta
 * @property integer $time_periods_before_actual
 * @property float $expected_workload
 * @property float $expected_average_handle_time
 * @property float $expected_volume
 * @method static \Illuminate\Database\Query\Builder|\MonthForecast whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\MonthForecast whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\MonthForecast whereUpdatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\MonthForecast wherePredictionStartTime($value)
 * @method static \Illuminate\Database\Query\Builder|\MonthForecast wherePredictionEndTime($value)
 * @method static \Illuminate\Database\Query\Builder|\MonthForecast whereWorkstreamId($value)
 * @method static \Illuminate\Database\Query\Builder|\MonthForecast whereOrganisationId($value)
 * @method static \Illuminate\Database\Query\Builder|\MonthForecast whereMethodId($value)
 * @method static \Illuminate\Database\Query\Builder|\MonthForecast whereAccuracyDelta($value)
 * @method static \Illuminate\Database\Query\Builder|\MonthForecast whereTimePeriodsBeforeActual($value)
 * @method static \Illuminate\Database\Query\Builder|\MonthForecast whereExpectedWorkload($value)
 * @method static \Illuminate\Database\Query\Builder|\MonthForecast whereExpectedAverageHandleTime($value)
 * @method static \Illuminate\Database\Query\Builder|\MonthForecast whereExpectedVolume($value)
 * @property float $workload_delta
 * @property float $average_handle_time_delta
 * @property float $volume_delta
 * @method static \Illuminate\Database\Query\Builder|\MonthForecast whereWorkloadDelta($value)
 * @method static \Illuminate\Database\Query\Builder|\MonthForecast whereAverageHandleTimeDelta($value)
 * @method static \Illuminate\Database\Query\Builder|\MonthForecast whereVolumeDelta($value)
 */
Class MonthForecast extends \LaravelArdent\Ardent\Ardent
{
    protected $table='month_forecasts';

    protected $connection = 'forecast_mysql';

    protected $dates = array('prediction_start_time', 'prediction_end_time');
}