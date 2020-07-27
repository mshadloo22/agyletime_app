<?php
use Illuminate\Database\Eloquent\Model;
// Model:'ShiftRole' - Database Table: 'Shift_Role'

/**
 * ShiftRole
 *
 * @property integer $role_id
 * @property integer $rostered_shift_id
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property-read \Role $role
 * @property-read \RosteredShift $rosteredshift
 * @method static \Illuminate\Database\Query\Builder|\ShiftRole whereRoleId($value)
 * @method static \Illuminate\Database\Query\Builder|\ShiftRole whereRosteredShiftId($value)
 * @method static \Illuminate\Database\Query\Builder|\ShiftRole whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\ShiftRole whereUpdatedAt($value)
 */
Class ShiftRole extends Model
{

    protected $table='shift_role';

    public function role()
    {
        return $this->belongsTo('Role');
    }

    public function rosteredshift()
    {
        return $this->belongsTo('RosteredShift');
    }

}