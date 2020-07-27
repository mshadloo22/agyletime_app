<?php
use Illuminate\Database\Eloquent\Model;
// Model:'TimesheetBreak' - Database Table: 'Timesheet_Break'

/**
 * TimesheetBreak
 *
 * @property integer $id
 * @property integer $timesheet_shift_id
 * @property \Carbon\Carbon $start_time
 * @property \Carbon\Carbon $finish_time
 * @property integer $break_length
 * @property-read \TimesheetShift $timesheetshift
 * @method static \Illuminate\Database\Query\Builder|\TimesheetBreak whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\TimesheetBreak whereTimesheetShiftId($value)
 * @method static \Illuminate\Database\Query\Builder|\TimesheetBreak whereStartTime($value)
 * @method static \Illuminate\Database\Query\Builder|\TimesheetBreak whereFinishTime($value)
 * @method static \Illuminate\Database\Query\Builder|\TimesheetBreak whereBreakLength($value)
 */
Class TimesheetBreak extends Model
{
    protected $table='timesheet_break';

    public $timestamps = false;

    protected $dates = array('start_time', 'finish_time');

    public function timesheetshift()
    {
        return $this->belongsTo('TimesheetShift');
    }

}