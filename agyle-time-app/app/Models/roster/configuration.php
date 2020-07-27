<?php

use Illuminate\Database\Eloquent\Model;
Class Configuration extends Model
{
    protected $table = 'configuration';

    public function configpriority()
    {
        return $this->hasMany('ConfigPriority');
    }

    public function configgroup()
    {
        return $this->belongsToMany('ConfigGroup', 'configuration_config_group', 'configuration_id', 'config_group_id')->withTimestamps();
    }
}