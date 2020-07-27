<?php
use Illuminate\Database\Eloquent\Model;
// Model:'UserAvailGen' - Database Table: 'User_Avail_Gen'

/**
 * UserAvailGen
 *
 * @property integer $user_id
 * @property integer $availability_general_id
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property-read \User $user
 * @property-read \AvailGeneral $availgeneral
 * @method static \Illuminate\Database\Query\Builder|\UserAvailGen whereUserId($value)
 * @method static \Illuminate\Database\Query\Builder|\UserAvailGen whereAvailabilityGeneralId($value)
 * @method static \Illuminate\Database\Query\Builder|\UserAvailGen whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\UserAvailGen whereUpdatedAt($value)
 */
Class UserAvailGen extends Model
{
    protected $table='user_avail_gen';

    public function user()
    {
        return $this->belongsTo('\App\Models\Roster\User');
    }

    public function availgeneral()
    {
        return $this->belongsTo('AvailGeneral');
    }

}