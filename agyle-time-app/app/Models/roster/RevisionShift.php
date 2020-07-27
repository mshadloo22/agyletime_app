<?php

namespace App\Models\Roster;

use Illuminate\Database\Eloquent\Model;

class RevisionShift extends Model
{
    //
    protected $table = 'revision_shifts';
    public function revision() {
        return $this->belongTo('\App\Models\Roster\Revision');
    }

    public function oldUser() {
        return $this->hasOne('\App\Models\Roster\User', 'id', 'old_user_id');
    }
    public function newUser() {
        return $this->hasOne('\App\Models\Roster\User', 'id', 'new_user_id');
    }
    public function task() {
        return $this->hasOne('\Task', 'id', 'task_id');
    }
//    public function currentUser() {
//        return $this->hasOne('\App\Models\Roster\User', 'id', 'current_user_id');
//    }

}


