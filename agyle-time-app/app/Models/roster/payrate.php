<?php
use Illuminate\Database\Eloquent\Model;
// Model:'PayRate' - Database Table: 'Pay_Rate'

/**
 * PayRate
 *
 * @property integer $id
 * @property float $pay_rate
 * @property string $description
 * @property string $unit_type
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection|\UserPayRate[] $userpayrate
 * @property-read \Illuminate\Database\Eloquent\Collection|\User[] $user
 * @method static \Illuminate\Database\Query\Builder|\PayRate whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\PayRate wherePayRate($value)
 * @method static \Illuminate\Database\Query\Builder|\PayRate whereDescription($value)
 * @method static \Illuminate\Database\Query\Builder|\PayRate whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\PayRate whereUpdatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\PayRate whereUnitType($value)
 */
Class PayRate extends Model
{

    protected $table='pay_rate';

    protected $fillable = array('pay_rate', 'unit_type');

    protected $dates = ['start_date', 'end_date'];

    public function userpayrate()
    {
        return $this->belongsToMany('UserPayRate');
    }

    public function user()
    {
        return $this->belongsToMany('\App\Models\Roster\User', 'user_pay_rate', 'pay_rate_id', 'user_id')->withPivot('start_date', 'end_date', 'id');
    }
}