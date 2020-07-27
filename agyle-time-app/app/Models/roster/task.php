<?php
use Illuminate\Database\Eloquent\Model;
// Model:'Task' - Database Table: 'Tasks'

/**
 * Task
 *
 * @property integer $id
 * @property integer $organisation_id
 * @property string $name
 * @property string $description
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property string $identifier
 * @property boolean $available
 * @property boolean $paid
 * @property boolean $planned
 * @property string $color
 * @property-read \Illuminate\Database\Eloquent\Collection|\ShiftTask[] $shifttask
 * @property-read \Organisation $organisation
 * @property-read \Illuminate\Database\Eloquent\Collection|\RosteredShift[] $rosteredshift
 * @property boolean $timeout
 * @property-read \Illuminate\Database\Eloquent\Collection|\ScheduledShift[] $scheduledshift
 * @method static \Illuminate\Database\Query\Builder|\Task whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\Task whereOrganisationId($value)
 * @method static \Illuminate\Database\Query\Builder|\Task whereName($value)
 * @method static \Illuminate\Database\Query\Builder|\Task whereDescription($value)
 * @method static \Illuminate\Database\Query\Builder|\Task whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\Task whereUpdatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\Task whereIdentifier($value)
 * @method static \Illuminate\Database\Query\Builder|\Task whereAvailable($value)
 * @method static \Illuminate\Database\Query\Builder|\Task wherePaid($value)
 * @method static \Illuminate\Database\Query\Builder|\Task wherePlanned($value)
 * @method static \Illuminate\Database\Query\Builder|\Task whereColor($value)
 * @method static \Illuminate\Database\Query\Builder|\Task whereTimeout($value)
 */
Class Task extends Model
{
    protected $table = 'tasks';

    protected $fillable = array('organisation_id', 'name', 'description', 'identifier','available', 'paid', 'planned', 'timeout', 'color');

    public function shifttask()
    {
        return $this->hasMany('ShiftTask');
    }

    public function organisation()
    {
        return $this->belongsTo('Organisation');
    }

    public function rosteredshift()
    {
        return $this->belongsToMany('RosteredShift', 'shift_tasks', 'task_id', 'rostered_shift_id')
            ->withTimestamps()
            ->withPivot('id', 'added_by', 'notes', 'start_time', 'end_time');
    }

    public function scheduledshift()
    {
        return $this->belongsToMany('ScheduledShift', 'shift_tasks', 'task_id', 'scheduled_shift_id')
                    ->withTimestamps()
                    ->withPivot('id', 'added_by', 'notes', 'start_time', 'end_time');
    }
    public function revisionShift() {
        return $this->belongsTo('\App\Model\Roster\RevisionShift');
    }
}