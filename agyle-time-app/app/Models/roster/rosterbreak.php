<?php
use Illuminate\Database\Eloquent\Model;
// Model:'RosterBreak' - Database Table: 'Roster_Break'

/**
 * RosterBreak
 *
 * @property integer $id
 * @property integer $rostered_shift_id
 * @property \Carbon\Carbon $start_time
 * @property \Carbon\Carbon $finish_time
 * @property integer $break_length
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property-read \RosteredShift $rosteredshift
 * @method static \Illuminate\Database\Query\Builder|\RosterBreak whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\RosterBreak whereRosteredShiftId($value)
 * @method static \Illuminate\Database\Query\Builder|\RosterBreak whereStartTime($value)
 * @method static \Illuminate\Database\Query\Builder|\RosterBreak whereFinishTime($value)
 * @method static \Illuminate\Database\Query\Builder|\RosterBreak whereBreakLength($value)
 * @method static \Illuminate\Database\Query\Builder|\RosterBreak whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\RosterBreak whereUpdatedAt($value)
 */
Class RosterBreak extends Model
{
    protected $table='roster_break';

    protected $dates = array('start_time', 'finish_time');

    public function rosteredshift()
    {
        return $this->belongsTo('RosteredShift');
    }

}