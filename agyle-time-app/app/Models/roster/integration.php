<?php
use Illuminate\Database\Eloquent\Model;
/**
 * Integration
 *
 * @property integer $id
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property string $name
 * @property string $configuration
 * @property-read \Illuminate\Database\Eloquent\Collection|\TimesheetIntegration[] $timesheetintegration
 * @property-read \Illuminate\Database\Eloquent\Collection|\Timesheet[] $timesheet
 * @property-read \Illuminate\Database\Eloquent\Collection|\Organisation[] $organisation
 * @property-read \Illuminate\Database\Eloquent\Collection|\User[] $user
 * @method static \Illuminate\Database\Query\Builder|\Integration whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\Integration whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\Integration whereUpdatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\Integration whereName($value)
 * @method static \Illuminate\Database\Query\Builder|\Integration whereConfiguration($value)
 */
Class Integration extends Model
{
    protected $table='integrations';

    public function timesheetintegration()
    {
        return $this->hasMany('TimesheetIntegration');
    }

    public function timesheet()
    {
        return $this->belongsToMany('Timesheet', 'timesheet_integrations', 'integration_id', 'timesheet_id')->withTimestamps()->withPivot('sent');
    }

    public function organisation()
    {
        return $this->belongsToMany('Organisation', 'organisation_integrations', 'integration_id', 'organisation_id')->withTimestamps()->withPivot('configuration');
    }

    public function user()
    {
        return $this->belongsToMany('\App\Models\Roster\User', 'user_integrations', 'integration_id', 'user_id')->withTimestamps()->withPivot('configuration');
    }
}
