<?php

namespace App\Models\Roster;

use Illuminate\Database\Eloquent\Model;

class Revision extends Model
{
    //
    public function revisionShifts(){
        return $this->hasMany('\App\Models\Roster\RevisionShift');
    }
    public function modifiedBy() {
        return $this->hasOne('\App\Models\Roster\User', 'id', 'modified_by');
    }
}
