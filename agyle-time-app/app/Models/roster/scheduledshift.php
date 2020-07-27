<?php

/**
 * ScheduledShift
 *
 * @property integer $id
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property integer $schedule_id
 * @property integer $rostered_shift_id
 * @property \Carbon\Carbon $date
 * @property \Carbon\Carbon $start_time
 * @property \Carbon\Carbon $end_time
 * @property-read \Illuminate\Database\Eloquent\Collection|\ShiftTask[] $shifttask
 * @property-read \Schedule $schedule
 * @property-read \RosteredShift $rosteredshift
 * @property-read \Illuminate\Database\Eloquent\Collection|\Task[] $task
 * @method static \Illuminate\Database\Query\Builder|\ScheduledShift whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\ScheduledShift whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\ScheduledShift whereUpdatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\ScheduledShift whereScheduleId($value)
 * @method static \Illuminate\Database\Query\Builder|\ScheduledShift whereRosteredShiftId($value)
 * @method static \Illuminate\Database\Query\Builder|\ScheduledShift whereDate($value)
 * @method static \Illuminate\Database\Query\Builder|\ScheduledShift whereStartTime($value)
 * @method static \Illuminate\Database\Query\Builder|\ScheduledShift whereEndTime($value)
 */
Class ScheduledShift extends Model
{
    protected $table='scheduled_shift';

    protected $dates = array('date', 'start_time', 'end_time');

    public function shifttask()
    {
        return $this->hasMany('ShiftTask');
    }

    public function schedule()
    {
        return $this->belongsTo('Schedule');
    }

    public function rosteredshift()
    {
        return $this->belongsTo('RosteredShift', 'rostered_shift_id');
    }

    public function task()
    {
        return $this->belongsToMany('Task', 'shift_tasks', 'scheduled_shift_id', 'task_id')
                    ->withTimestamps()
                    ->withPivot('id', 'added_by', 'notes', 'start_time', 'end_time');
    }

    public function getDurationInHours(){
        $datestart = new ExpressiveDate($this->start_time);
        $dateend = new ExpressiveDate($this->end_time);
        return $datestart->getDifferenceInHours($dateend);
    }

}