<?php
use Illuminate\Database\Eloquent\Model;
// Model:'Timesheet' - Database Table: 'Timesheet'

/**
 * Timesheet
 *
 * @property integer $id
 * @property integer $user_id
 * @property string $approval_stage
 * @property \Carbon\Carbon $date_start
 * @property \Carbon\Carbon $date_end
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property string $notes
 * @property-read \Illuminate\Database\Eloquent\Collection|\TimesheetShift[] $timesheetshift
 * @property-read \User $user
 * @property-read \Illuminate\Database\Eloquent\Collection|\TimesheetIntegration[] $timesheetintegration
 * @property-read \Illuminate\Database\Eloquent\Collection|\Integration[] $integration
 * @method static \Illuminate\Database\Query\Builder|\Timesheet whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\Timesheet whereUserId($value)
 * @method static \Illuminate\Database\Query\Builder|\Timesheet whereApprovalStage($value)
 * @method static \Illuminate\Database\Query\Builder|\Timesheet whereDateStart($value)
 * @method static \Illuminate\Database\Query\Builder|\Timesheet whereDateEnd($value)
 * @method static \Illuminate\Database\Query\Builder|\Timesheet whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\Timesheet whereUpdatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\Timesheet whereNotes($value)
 */
Class Timesheet extends Model
{
    protected $table='timesheet';

    protected $dates = array('date_start' , 'date_end');

    public function timesheetshift()
    {
        return $this->hasMany('TimesheetShift');
    }

    public function user()
    {
        return $this->belongsTo('\App\Models\Roster\User');
    }

    public function timesheetintegration()
    {
        return $this->hasMany('TimesheetIntegration');
    }

    public function integration()
    {
        return $this->belongsToMany('Integration', 'timesheet_integrations', 'timesheet_id', 'integration_id')->withTimestamps()->withPivot('sent');
    }


}