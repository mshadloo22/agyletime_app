<?php

Class PublishedForecast extends \LaravelArdent\Ardent\Ardent
{
    protected $table='published_forecast';

    protected $connection = 'forecast_mysql';

    protected $dates = array('start_date', 'end_date');

    protected $guarded = array('id', 'created_at', 'updated_at');

    public function forecastpoint()
    {
        return $this->hasMany('ForecastPoint');
    }
}