<?php

// Model:'DayForecast' - Database Table: 'day_forecasts'

/**
 * DayForecast
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
 * @method static \Illuminate\Database\Query\Builder|\DayForecast whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\DayForecast whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\DayForecast whereUpdatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\DayForecast wherePredictionStartTime($value)
 * @method static \Illuminate\Database\Query\Builder|\DayForecast wherePredictionEndTime($value)
 * @method static \Illuminate\Database\Query\Builder|\DayForecast whereWorkstreamId($value)
 * @method static \Illuminate\Database\Query\Builder|\DayForecast whereOrganisationId($value)
 * @method static \Illuminate\Database\Query\Builder|\DayForecast whereMethodId($value)
 * @method static \Illuminate\Database\Query\Builder|\DayForecast whereAccuracyDelta($value)
 * @method static \Illuminate\Database\Query\Builder|\DayForecast whereTimePeriodsBeforeActual($value)
 * @method static \Illuminate\Database\Query\Builder|\DayForecast whereExpectedWorkload($value)
 * @method static \Illuminate\Database\Query\Builder|\DayForecast whereExpectedAverageHandleTime($value)
 * @method static \Illuminate\Database\Query\Builder|\DayForecast whereExpectedVolume($value)
 * @property float $workload_delta
 * @property float $average_handle_time_delta
 * @property float $volume_delta
 * @method static \Illuminate\Database\Query\Builder|\DayForecast whereWorkloadDelta($value)
 * @method static \Illuminate\Database\Query\Builder|\DayForecast whereAverageHandleTimeDelta($value)
 * @method static \Illuminate\Database\Query\Builder|\DayForecast whereVolumeDelta($value)
 */
Class DayForecast extends \LaravelArdent\Ardent\Ardent
{
    protected $table='day_forecasts';

    protected $connection = 'forecast_mysql';

    protected $dates = array('prediction_start_time', 'prediction_end_time');
}