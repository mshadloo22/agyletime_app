<?php

// Model:'HourForecast' - Database Table: 'hour_forecasts'

/**
 * HourForecast
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
 * @method static \Illuminate\Database\Query\Builder|\HourForecast whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\HourForecast whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\HourForecast whereUpdatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\HourForecast wherePredictionStartTime($value)
 * @method static \Illuminate\Database\Query\Builder|\HourForecast wherePredictionEndTime($value)
 * @method static \Illuminate\Database\Query\Builder|\HourForecast whereWorkstreamId($value)
 * @method static \Illuminate\Database\Query\Builder|\HourForecast whereOrganisationId($value)
 * @method static \Illuminate\Database\Query\Builder|\HourForecast whereMethodId($value)
 * @method static \Illuminate\Database\Query\Builder|\HourForecast whereAccuracyDelta($value)
 * @method static \Illuminate\Database\Query\Builder|\HourForecast whereTimePeriodsBeforeActual($value)
 * @method static \Illuminate\Database\Query\Builder|\HourForecast whereExpectedWorkload($value)
 * @method static \Illuminate\Database\Query\Builder|\HourForecast whereExpectedAverageHandleTime($value)
 * @method static \Illuminate\Database\Query\Builder|\HourForecast whereExpectedVolume($value)
 * @property float $workload_delta
 * @property float $average_handle_time_delta
 * @property float $volume_delta
 * @method static \Illuminate\Database\Query\Builder|\HourForecast whereWorkloadDelta($value)
 * @method static \Illuminate\Database\Query\Builder|\HourForecast whereAverageHandleTimeDelta($value)
 * @method static \Illuminate\Database\Query\Builder|\HourForecast whereVolumeDelta($value)
 */
Class HourForecast extends \LaravelArdent\Ardent\Ardent
{
    protected $table='hour_forecasts';

    protected $connection = 'forecast_mysql';

    protected $dates = array('prediction_start_time', 'prediction_end_time');
}