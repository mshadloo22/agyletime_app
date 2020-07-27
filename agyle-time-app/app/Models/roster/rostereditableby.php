<?php
use Illuminate\Database\Eloquent\Model;
// Model:'RosterEditableBy' - Database Table: 'Roster_Editable_By'

/**
 * RosterEditableBy
 *
 * @property integer $user_id
 * @property integer $roster_id
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property-read \User $user
 * @property-read \Roster $roster
 * @method static \Illuminate\Database\Query\Builder|\RosterEditableBy whereUserId($value)
 * @method static \Illuminate\Database\Query\Builder|\RosterEditableBy whereRosterId($value)
 * @method static \Illuminate\Database\Query\Builder|\RosterEditableBy whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\RosterEditableBy whereUpdatedAt($value)
 */
Class RosterEditableBy extends Model
{

    protected $table='roster_editable_by';

    public function user()
    {
        return $this->belongsTo('\App\Models\Roster\User');
    }

    public function roster()
    {
        return $this->belongsTo('Roster');
    }

}