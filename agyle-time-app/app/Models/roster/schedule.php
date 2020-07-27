<?php
use Illuminate\Database\Eloquent\Model;
/**
 * Schedule
 *
 * @property integer $id
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property integer $role_id
 * @property \Carbon\Carbon $start_date
 * @property \Carbon\Carbon $end_date
 * @property-read \Illuminate\Database\Eloquent\Collection|\ScheduledShift[] $scheduledshift
 * @property-read \Role $role
 * @method static \Illuminate\Database\Query\Builder|\Schedule whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\Schedule whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\Schedule whereUpdatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\Schedule whereRoleId($value)
 * @method static \Illuminate\Database\Query\Builder|\Schedule whereStartDate($value)
 * @method static \Illuminate\Database\Query\Builder|\Schedule whereEndDate($value)
 */
Class Schedule extends Model
{
    protected $table='schedule';

    protected $guarded=array('id', 'created_at', 'updated_at');

    protected $dates = array('start_date', 'end_date');

    public function scheduledshift()
    {
        return $this->hasMany('ScheduledShift');
    }
    public function role()
    {
        return $this->belongsTo('Role');
    }

}