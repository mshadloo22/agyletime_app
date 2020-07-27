<?php

use Illuminate\Database\Eloquent\Model;
Class Campaign extends Model
{
    protected $table = 'campaign';

    public function organisation()
    {
        return $this->belongsTo('Organisation');
    }

    public function partner()
    {
        return $this->belongsTo('Partner');
    }

    public function team()
    {
        return $this->hasMany('Team');
    }

    public function configpriority()
    {
        return $this->morphMany('ConfigPriority', 'configurable');
    }
}