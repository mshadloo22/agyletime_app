<?php
use Illuminate\Database\Eloquent\Model;
// Model:'Role' - Database Table: 'Role'

/**
 * Role
 *
 * @property integer $id
 * @property integer $organisation_id
 * @property string $name
 * @property string $description
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection|\ShiftRole[] $shiftrole
 * @property-read \Organisation $organisation
 * @property-read \Illuminate\Database\Eloquent\Collection|\Schedule[] $schedule
 * @property-read \Illuminate\Database\Eloquent\Collection|\Workstream[] $workstream
 * @property-read \Illuminate\Database\Eloquent\Collection|\user[] $user
 * @method static \Illuminate\Database\Query\Builder|\Role whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\Role whereOrganisationId($value)
 * @method static \Illuminate\Database\Query\Builder|\Role whereName($value)
 * @method static \Illuminate\Database\Query\Builder|\Role whereDescription($value)
 * @method static \Illuminate\Database\Query\Builder|\Role whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\Role whereUpdatedAt($value)
 */
Class Role extends Model
{

    protected $table='role';

    protected $guarded = array('id');

    public function shiftrole()
    {
        return $this->hasMany('ShiftRole');
    }

    public function organisation()
    {
        return $this->belongsTo('Organisation');
    }

    public function schedule()
    {
        return $this->hasMany('Schedule');
    }

    public function workstream()
    {
        return $this->hasMany('Workstream');
    }

    public function user()
    {
        return $this->belongsToMany('user', 'user_role', 'role_id', 'user_id')
                    ->withTimestamps();
    }

}