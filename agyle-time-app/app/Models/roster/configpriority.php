<?php

use \App\Models\Roster\User;
use Illuminate\Database\Eloquent\Model;
Class ConfigPriority extends Model
{
    protected $table = 'config_priority';

    protected $fillable = array('value', 'priority', 'organisation_id');

    public function configuration()
    {
        return $this->belongsTo('Configuration');
    }

    public function organisation()
    {
        return $this->belongsTo('Organisation');
    }

    public function configurable()
    {
        return $this->morphTo();
    }

    public function scopeHighestPriority($query, $object)
    {
        $query->where(function($query) use ($object)
        {
            if($object instanceof User)
            {
                $query->orWhere(function($query) use ($object) {
                    $query->whereConfigurableType('User')
                        ->whereConfigurableId($object->id);
                });
                $object = $object->team;
            }

            if($object instanceof Team)
            {
                $query->orWhere(function($query) use ($object) {
                    $query->whereConfigurableType('Team')
                          ->whereConfigurableId($object->id);
                });
                $object = $object->campaign;
            }

            if($object instanceof Campaign)
            {
                $query->orWhere(function($query) use ($object) {
                    $query->whereConfigurableType('Campaign')
                          ->whereConfigurableId($object->id);
                });
                $object = $object->partner;
            }

            if($object instanceof Partner)
            {
                $query->orWhere(function($query) use ($object) {
                    $query->whereConfigurableType('Partner')
                          ->whereConfigurableId($object->id);
                });
                $object = $object->organisation;
            }

            if($object instanceof Organisation)
            {
                $query->orWhere(function($query) use ($object) {
                    $query->whereConfigurableType('Organisation')
                          ->whereConfigurableId($object->id);
                });
            }
        });

        return $query->select(DB::raw('*, min(priority) as priority'));
    }
}