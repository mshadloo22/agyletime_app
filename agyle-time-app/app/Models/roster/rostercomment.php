<?php
use Illuminate\Database\Eloquent\Model;
// Model:'RosterComment' - Database Table: 'Roster_Comments'

/**
 * RosterComment
 *
 * @property integer $id
 * @property integer $user_id
 * @property integer $roster_id
 * @property string $comment
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property-read \User $user
 * @property-read \Roster $roster
 * @method static \Illuminate\Database\Query\Builder|\RosterComment whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\RosterComment whereUserId($value)
 * @method static \Illuminate\Database\Query\Builder|\RosterComment whereRosterId($value)
 * @method static \Illuminate\Database\Query\Builder|\RosterComment whereComment($value)
 * @method static \Illuminate\Database\Query\Builder|\RosterComment whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\RosterComment whereUpdatedAt($value)
 */
Class RosterComment extends Model
{

    protected $table='roster_comments';

    public function user()
    {
        return $this->belongsTo('\App\Models\Roster\User');
    }

    public function roster()
    {
        return $this->belongsTo('Roster');
    }

}