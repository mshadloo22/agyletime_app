<?php
use Illuminate\Database\Eloquent\Model;
// Model:'Workstream' - Database Table: 'workstreams'

/**
 * Workstream
 *
 * @property integer $id
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property string $name
 * @property string $description
 * @property integer $organisation_id
 * @property string $color
 * @property integer $wait_time_threshold
 * @property-read \Illuminate\Database\Eloquent\Collection|\Subtask[] $subtask
 * @property-read \Organisation $organisation
 * @property integer $role_id
 * @property integer $grade_of_service
 * @property-read \Role $role
 * @method static \Illuminate\Database\Query\Builder|\Workstream whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\Workstream whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\Workstream whereUpdatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\Workstream whereName($value)
 * @method static \Illuminate\Database\Query\Builder|\Workstream whereDescription($value)
 * @method static \Illuminate\Database\Query\Builder|\Workstream whereRoleId($value)
 * @method static \Illuminate\Database\Query\Builder|\Workstream whereOrganisationId($value)
 * @method static \Illuminate\Database\Query\Builder|\Workstream whereColor($value)
 * @method static \Illuminate\Database\Query\Builder|\Workstream whereWaitTimeThreshold($value)
 * @method static \Illuminate\Database\Query\Builder|\Workstream whereGradeOfService($value)
 * @property integer $aht_goal
 * @property integer $abandon_threshold
 * @method static \Illuminate\Database\Query\Builder|\Workstream whereAhtGoal($value)
 * @method static \Illuminate\Database\Query\Builder|\Workstream whereAbandonThreshold($value)
 * @property integer $forecast_method_id
 * @method static \Illuminate\Database\Query\Builder|\Workstream whereForecastMethodId($value)
 */
Class Workstream extends Model
{
    protected $table='workstreams';

    protected $guarded = array('id');

    public function subtask()
    {
        return $this->hasMany('Subtask');
    }

    public function role()
    {
        return $this->belongsTo('Role');
    }

    public function organisation()
    {
        return $this->belongsTo('Organisation');
    }

    public function forecastmethod()
    {
        return $this->belongsTo('ForecastMethod');
    }
}