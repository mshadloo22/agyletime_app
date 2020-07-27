<?php
use Illuminate\Database\Eloquent\Model;
// Model:'UserPayRate' - Database Table: 'User_Pay_Rate'

/**
 * UserPayRate
 *
 * @property integer $id
 * @property integer $user_id
 * @property integer $pay_rate_id
 * @property \Carbon\Carbon $start_date
 * @property \Carbon\Carbon $end_date
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property-read \User $user
 * @property-read \PayRate $payrate
 * @method static \Illuminate\Database\Query\Builder|\UserPayRate whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\UserPayRate whereUserId($value)
 * @method static \Illuminate\Database\Query\Builder|\UserPayRate wherePayRateId($value)
 * @method static \Illuminate\Database\Query\Builder|\UserPayRate whereStartDate($value)
 * @method static \Illuminate\Database\Query\Builder|\UserPayRate whereEndDate($value)
 * @method static \Illuminate\Database\Query\Builder|\UserPayRate whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\UserPayRate whereUpdatedAt($value)
 */
Class UserPayRate extends Model
{
    protected $table='user_pay_rate';

    protected $dates = array('start_date', 'end_date');

    public function user()
    {
        return $this->belongsTo('\App\Models\Roster\User');
    }

    public function payrate()
    {
        return $this->belongsTo('PayRate');
    }

}