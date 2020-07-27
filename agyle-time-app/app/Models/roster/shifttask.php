<?php
use Illuminate\Database\Eloquent\Model;
// Model:'ShiftTask' - Database Table: 'Shift_Tasks'

/**
 * ShiftTask
 *
 * @property integer $id
 * @property integer $task_id
 * @property integer $rostered_shift_id
 * @property integer $added_by
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property string $notes
 * @property \Carbon\Carbon $start_time
 * @property \Carbon\Carbon $end_time
 * @property-read \Task $task
 * @property-read \RosteredShift $rosteredshift
 * @property-read \User $user
 * @property integer $scheduled_shift_id
 * @property-read \ScheduledShift $scheduledshift
 * @property-read \Illuminate\Database\Eloquent\Collection|\TaskData[] $taskdata
 * @method static \Illuminate\Database\Query\Builder|\ShiftTask whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\ShiftTask whereTaskId($value)
 * @method static \Illuminate\Database\Query\Builder|\ShiftTask whereRosteredShiftId($value)
 * @method static \Illuminate\Database\Query\Builder|\ShiftTask whereScheduledShiftId($value)
 * @method static \Illuminate\Database\Query\Builder|\ShiftTask whereAddedBy($value)
 * @method static \Illuminate\Database\Query\Builder|\ShiftTask whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\ShiftTask whereUpdatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\ShiftTask whereNotes($value)
 * @method static \Illuminate\Database\Query\Builder|\ShiftTask whereStartTime($value)
 * @method static \Illuminate\Database\Query\Builder|\ShiftTask whereEndTime($value)
 */
Class ShiftTask extends Model
{
    protected $table='shift_tasks';

    protected $dates = array('start_time', 'end_time');

    protected $guarded = array('id');

    public function task()
    {
        return $this->belongsTo('Task');
    }

    public function rosteredshift()
    {
        return $this->belongsTo('RosteredShift');
    }

    public function scheduledshift()
    {
        return $this->belongsTo('ScheduledShift');
    }

    public function user()
    {
        return $this->belongsTo('\App\Models\Roster\User');
    }

    public function taskdata()
    {
        return $this->hasMany('TaskData', 'shift_tasks_id');
    }

    public function afterCreate()
    {
        $this->createShiftTaskHistory('created');
    }

    public function afterUpdate()
    {
        $this->createShiftTaskHistory('updated');
    }

    public function beforeDelete()
    {
        $this->createShiftTaskHistory('deleted');
    }

    private function createShiftTaskHistory($event_type)
    {
        $attributes = [
            'event_type' => $event_type,
            'shift_tasks_id' => $this->attributes['id'],
            'task_id' => $this->attributes['task_id']
        ];
        $created_event = RosteredShiftHistory::whereRosteredShiftId($this->rostered_shift_id)->whereEventType('created')->first();

        if(!isset($created_event))
            $created_event = RosteredShiftHistory::whereRosteredShiftId($this->rostered_shift_id)->whereEventType('updated')->orderBy('created_at', 'asc')->first();

        if(isset($created_event))
            $attributes['rostered_shift_history_id'] = $created_event->id;

        if($event_type !== 'deleted')
        {
            $attributes['start_time'] = $this->attributes['start_time'];
            $attributes['end_time'] = $this->attributes['end_time'];
        }
        ShiftTaskHistory::create($attributes);
    }

}