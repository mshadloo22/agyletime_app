<?php
use Illuminate\Database\Eloquent\Model;
// Model:'RosteredShift' - Database Table: 'Rostered_Shift'

use Carbon\Carbon;


/**
 * RosteredShift
 *
 * @property integer $id
 * @property integer $roster_id
 * @property integer $user_id
 * @property \Carbon\Carbon $date
 * @property \Carbon\Carbon $rostered_start_time
 * @property \Carbon\Carbon $rostered_end_time
 * @property \Carbon\Carbon $start_time
 * @property \Carbon\Carbon $end_time
 * @property string $notes
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection|\RosterBreak[] $rosterbreak
 * @property-read \Illuminate\Database\Eloquent\Collection|\RosteredShiftModified[] $rosteredshiftmodified
 * @property-read \Illuminate\Database\Eloquent\Collection|\ShiftRole[] $shiftrole
 * @property-read \Illuminate\Database\Eloquent\Collection|\ShiftTask[] $shifttask
 * @property-read \Roster $roster
 * @property-read \User $user
 * @property-read \User $user_for_roster
 * @property-read \Illuminate\Database\Eloquent\Collection|\Task[] $task
 * @property-read \Illuminate\Database\Eloquent\Collection|\ScheduledShift[] $scheduledshift
 * @property-read \ShiftData $shiftdata
 * @method static \Illuminate\Database\Query\Builder|\RosteredShift whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\RosteredShift whereRosterId($value)
 * @method static \Illuminate\Database\Query\Builder|\RosteredShift whereUserId($value)
 * @method static \Illuminate\Database\Query\Builder|\RosteredShift whereDate($value)
 * @method static \Illuminate\Database\Query\Builder|\RosteredShift whereRosteredStartTime($value)
 * @method static \Illuminate\Database\Query\Builder|\RosteredShift whereRosteredEndTime($value)
 * @method static \Illuminate\Database\Query\Builder|\RosteredShift whereStartTime($value)
 * @method static \Illuminate\Database\Query\Builder|\RosteredShift whereEndTime($value)
 * @method static \Illuminate\Database\Query\Builder|\RosteredShift whereNotes($value)
 * @method static \Illuminate\Database\Query\Builder|\RosteredShift whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\RosteredShift whereUpdatedAt($value)
 */
Class RosteredShift extends Model
{

    protected $table='rostered_shift';

    protected $dates = array('date', 'rostered_start_time', 'rostered_end_time', 'start_time', 'end_time');

    protected $guarded = array('id');

    public function rosterbreak()
    {
        return $this->hasMany('RosterBreak');
    }

    public function rosteredshiftmodified()
    {
        return $this->hasMany('RosteredShiftModified');
    }

    public function shiftrole()
    {
        return $this->hasMany('ShiftRole');
    }

    public function shifttask()
    {
        return $this->hasMany('ShiftTask');
    }

    public function roster()
    {
        return $this->belongsTo('Roster');
    }

    public function user()
    {
        return $this->belongsTo('\App\Models\Roster\User');
    }

    public function user_for_roster()
    {
        return $this->belongsTo('\App\Models\Roster\User', 'user_id')->select(array('first_name', 'last_name', 'email'));
    }

    public function scheduledshift()
    {
        return $this->hasMany('ScheduledShift');
    }

    public function task()
    {
        return $this->belongsToMany('Task', 'shift_tasks', 'rostered_shift_id', 'task_id')
            ->withTimestamps()
            ->withPivot('id', 'added_by', 'notes', 'start_time', 'end_time');
    }

    public function shiftdata() {
        return $this->hasOne('ShiftData', 'shift_id');
    }

    public function adherenceexception() {
        return $this->hasMany('AdherenceException', 'rostered_shift_id');
    }

    public function getDurationInHours(){
        $datestart = new Carbon($this->rostered_start_time);
        $dateend = new Carbon($this->rostered_end_time);
        return $datestart->diffInHours($dateend);
    }

    public function afterCreate()
    {
        $this->createRosteredShiftHistory('created');
    }

    public function afterUpdate()
    {
        $this->createRosteredShiftHistory('updated');
    }

    public function beforeDelete()
    {
        $this->createRosteredShiftHistory('deleted');
    }

    private function createRosteredShiftHistory($event_type)
    {
        $attributes = [
            'event_type' => $event_type,
            'rostered_shift_id' => $this->attributes['id'],
            'user_id' => $this->attributes['user_id'],
            'roster_id' => $this->attributes['roster_id'],
            'date' => $this->attributes['date']
        ];

        if($event_type !== 'deleted')
        {
            $attributes['start_time'] = $this->attributes['rostered_start_time'];
            $attributes['end_time'] = $this->attributes['rostered_end_time'];
        }
        RosteredShiftHistory::create($attributes);
    }
}