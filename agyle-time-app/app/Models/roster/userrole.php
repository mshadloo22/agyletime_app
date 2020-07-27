<?php
use Illuminate\Database\Eloquent\Model;
/**
 * UserRole
 *
 * @property integer $id
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property integer $user_id
 * @property integer $role_id
 * @property-read \User $user
 * @property-read \Role $role
 * @method static \Illuminate\Database\Query\Builder|\UserRole whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\UserRole whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\UserRole whereUpdatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\UserRole whereUserId($value)
 * @method static \Illuminate\Database\Query\Builder|\UserRole whereRoleId($value)
 */
Class UserRole extends Model
{
    protected $table='user_role';

    public function user()
    {
        return $this->belongsTo('\App\Models\Roster\User');
    }

    public function role()
    {
        return $this->belongsTo('Role');
    }
}