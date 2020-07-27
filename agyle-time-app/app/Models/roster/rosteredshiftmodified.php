<?php
use Illuminate\Database\Eloquent\Model;
// Model:'RosteredShiftModified' - Database Table: 'Rostered_Shift_Modified'

/**
 * RosteredShiftModified
 *
 * @property integer $id
 * @property integer $rostered_shift_id
 * @property integer $user_id
 * @property string $event_details
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property-read \RosteredShift $rosteredshift
 * @property-read \User $user
 * @method static \Illuminate\Database\Query\Builder|\RosteredShiftModified whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\RosteredShiftModified whereRosteredShiftId($value)
 * @method static \Illuminate\Database\Query\Builder|\RosteredShiftModified whereUserId($value)
 * @method static \Illuminate\Database\Query\Builder|\RosteredShiftModified whereEventDetails($value)
 * @method static \Illuminate\Database\Query\Builder|\RosteredShiftModified whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\RosteredShiftModified whereUpdatedAt($value)
 */
Class RosteredShiftModified extends Model
{

    protected $table='rostered_shift_modified';

    public function rosteredshift()
    {
        return $this->belongsTo('RosteredShift');
    }

    public function user()
    {
        return $this->belongsTo('\App\Models\Roster\User');
    }

}