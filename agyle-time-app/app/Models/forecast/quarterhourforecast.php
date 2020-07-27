<?php

// Model:'QuarterHourForecast' - Database Table: 'quarter_hour_forecasts'

/**
 * QuarterHourForecast
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
 * @method static \Illuminate\Database\Query\Builder|\QuarterHourForecast whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\QuarterHourForecast whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\QuarterHourForecast whereUpdatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\QuarterHourForecast wherePredictionStartTime($value)
 * @method static \Illuminate\Database\Query\Builder|\QuarterHourForecast wherePredictionEndTime($value)
 * @method static \Illuminate\Database\Query\Builder|\QuarterHourForecast whereWorkstreamId($value)
 * @method static \Illuminate\Database\Query\Builder|\QuarterHourForecast whereOrganisationId($value)
 * @method static \Illuminate\Database\Query\Builder|\QuarterHourForecast whereMethodId($value)
 * @method static \Illuminate\Database\Query\Builder|\QuarterHourForecast whereAccuracyDelta($value)
 * @method static \Illuminate\Database\Query\Builder|\QuarterHourForecast whereTimePeriodsBeforeActual($value)
 * @method static \Illuminate\Database\Query\Builder|\QuarterHourForecast whereExpectedWorkload($value)
 * @method static \Illuminate\Database\Query\Builder|\QuarterHourForecast whereExpectedAverageHandleTime($value)
 * @method static \Illuminate\Database\Query\Builder|\QuarterHourForecast whereExpectedVolume($value)
 * @property float $workload_delta
 * @property float $average_handle_time_delta
 * @property float $volume_delta
 * @method static \Illuminate\Database\Query\Builder|\QuarterHourForecast whereWorkloadDelta($value)
 * @method static \Illuminate\Database\Query\Builder|\QuarterHourForecast whereAverageHandleTimeDelta($value)
 * @method static \Illuminate\Database\Query\Builder|\QuarterHourForecast whereVolumeDelta($value)
 */
Class QuarterHourForecast extends \LaravelArdent\Ardent\Ardent
{
    protected $table='quarter_hour_forecasts';

    protected $connection = 'forecast_mysql';

    protected $dates = array('prediction_start_time', 'prediction_end_time');
}