<?php
use Illuminate\Database\Eloquent\Model;
// Model:'Plan' - Database Table: 'Plan'

/**
 * Plan
 *
 * @property integer $id
 * @property string $name
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection|\Organisation[] $organisation
 * @method static \Illuminate\Database\Query\Builder|\Plan whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\Plan whereName($value)
 * @method static \Illuminate\Database\Query\Builder|\Plan whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\Plan whereUpdatedAt($value)
 */
Class Plan extends Model
{

    protected $table='plan';

    public function organisation()
    {
        return $this->hasMany('Organisation');
    }

}