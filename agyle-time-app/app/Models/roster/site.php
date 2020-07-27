<?php
use Illuminate\Database\Eloquent\Model;

Class Site extends Model
{
    protected $table = 'site';

    public function organisation()
    {
        return $this->belongsTo('Organisation');
    }

    public function user()
    {
        return $this->hasMany('\App\Models\Roster\User');
    }

    public function configpriority()
    {
        return $this->morphMany('ConfigPriority', 'configurable');
    }
}