<?php
use Illuminate\Database\Eloquent\Model;
// Model:'UserAvailSpec' - Database Table: 'User_Avail_Spec'

/**
 * UserAvailSpec
 *
 * @property integer $user_id
 * @property integer $availability_specific_id
 * @property string $employee_notes
 * @property string $management_notes
 * @property string $authorized
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property-read \User $user
 * @property-read \AvailSpecific $availspecific
 * @method static \Illuminate\Database\Query\Builder|\UserAvailSpec whereUserId($value)
 * @method static \Illuminate\Database\Query\Builder|\UserAvailSpec whereAvailabilitySpecificId($value)
 * @method static \Illuminate\Database\Query\Builder|\UserAvailSpec whereEmployeeNotes($value)
 * @method static \Illuminate\Database\Query\Builder|\UserAvailSpec whereManagementNotes($value)
 * @method static \Illuminate\Database\Query\Builder|\UserAvailSpec whereAuthorized($value)
 * @method static \Illuminate\Database\Query\Builder|\UserAvailSpec whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\UserAvailSpec whereUpdatedAt($value)
 */
Class UserAvailSpec extends Model
{
    protected $table='user_avail_spec';

    public function user()
    {
        return $this->belongsTo('\App\Models\Roster\User');
    }

    public function availspecific()
    {
        return $this->belongsTo('AvailSpecific');
    }

}