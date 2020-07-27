<?php

use Illuminate\Database\Eloquent\Model;
Class Partner extends Model
{
    protected $table = 'partner';

    public function organisation()
    {
        return $this->belongsTo('Organisation');
    }

    public function campaign()
    {
        return $this->hasMany('Campaign');
    }

    public function configpriority()
    {
        return $this->morphMany('ConfigPriority', 'configurable');
    }
}