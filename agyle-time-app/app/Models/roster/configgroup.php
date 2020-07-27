<?php

use Illuminate\Database\Eloquent\Model;
Class ConfigGroup extends Model
{
    protected $table = 'config_group';

    public function configpriority()
    {
        return $this->hasMany('ConfigPriority');
    }

    public function configuration()
    {
        return $this->belongsToMany('Configuration', 'configuration_config_group', 'config_group_id', 'configuration_id')->withTimestamps();
    }
}