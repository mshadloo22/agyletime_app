<?php
use Illuminate\Database\Eloquent\Model;
// Model:'TimesheetShift' - Database Table: 'Timesheet_Shift'

/**
 * TimesheetShift
 *
 * @property integer $id
 * @property integer $timesheet_id
 * @property \Carbon\Carbon $start_time
 * @property \Carbon\Carbon $finish_time
 * @property string $notes
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection|\TimesheetBreak[] $timesheetbreak
 * @property-read \Timesheet $timesheet
 * @property float $number_of_units
 * @method static \Illuminate\Database\Query\Builder|\TimesheetShift whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\TimesheetShift whereTimesheetId($value)
 * @method static \Illuminate\Database\Query\Builder|\TimesheetShift whereStartTime($value)
 * @method static \Illuminate\Database\Query\Builder|\TimesheetShift whereFinishTime($value)
 * @method static \Illuminate\Database\Query\Builder|\TimesheetShift whereNotes($value)
 * @method static \Illuminate\Database\Query\Builder|\TimesheetShift whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\TimesheetShift whereUpdatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\TimesheetShift whereNumberOfUnits($value)
 */
Class TimesheetShift extends Model
{
    protected $table='timesheet_shift';

    protected $dates = array('start_time', 'finish_time');

    public function timesheetbreak()
    {
        return $this->hasMany('TimesheetBreak');
    }

    public function timesheet()
    {
        return $this->belongsTo('Timesheet');
    }

    public function getDurationInHours(){
        $datestart = new Carbon($this->start_time);
        $dateend = new Carbon($this->finish_time);
        return $datestart->diffInHours($dateend);
    }

    public function getBreakDurationInHours(){
        if(isset($this->timesheetbreak, $this->timesheetbreak[0], $this->timesheetbreak[0]->break_length)){
            return round($this->timesheetbreak[0]->break_length / 60,2);
        }else{
            return 0;
        }
    }

}