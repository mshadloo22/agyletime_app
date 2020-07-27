<?php

Class ForecastPoint extends \LaravelArdent\Ardent\Ardent
{
    protected $table='forecast_point';

    protected $connection = 'forecast_mysql';

    protected $dates = array('start_time', 'end_time');

    protected $guarded = array('id', 'created_at', 'updated_at');

    public function publishedforecast()
    {
        return $this->belongsTo('PublishedForecast');
    }
}