<?php
use Illuminate\Database\Eloquent\Model;
// Model:'UserEvent' - Database Table: 'User_Event'

/**
 * UserEvent
 *
 * @property integer $id
 * @property integer $user_id
 * @property string $event_type_id
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property-read \User $user
 * @method static \Illuminate\Database\Query\Builder|\UserEvent whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\UserEvent whereUserId($value)
 * @method static \Illuminate\Database\Query\Builder|\UserEvent whereEventTypeId($value)
 * @method static \Illuminate\Database\Query\Builder|\UserEvent whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\UserEvent whereUpdatedAt($value)
 */
Class UserEvent extends Model
{

    protected $table='user_event';

    public function user()
    {
        return $this->belongsTo('\App\Models\Roster\User');
    }

}