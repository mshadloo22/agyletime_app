<?php

use Illuminate\Database\Eloquent\Model;
Class ForecastMethod extends Model
{
    protected $table = 'forecast_method';

    public function workstream()
    {
        return $this->hasMany('Workstream');
    }
}
