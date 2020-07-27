<?php

namespace App\Models\Roster;

use Illuminate\Database\Eloquent\Model;

class Feature extends Model
{
    protected $fillable = array('feature_key', 'name', 'description');
    public function organisations() {
        return $this->belongsToMany('Organisation')->withPivot('enabled')->withTimestamps();
    }
}
