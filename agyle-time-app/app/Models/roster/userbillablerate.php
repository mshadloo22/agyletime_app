<?php
use Illuminate\Database\Eloquent\Model;
// Model:'UserBillableRate' - Database Table: 'user_billable_rate'

/**
 * UserBillableRate
 *
 * @property integer $id
 * @property integer $user_id
 * @property integer $billable_rate_id
 * @property \Carbon\Carbon $start_date
 * @property \Carbon\Carbon $end_date
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property-read \User $user
 * @property-read \BillableRate $billablerate
 * @method static \Illuminate\Database\Query\Builder|\UserBillableRate whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\UserBillableRate whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\UserBillableRate whereUpdatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\UserBillableRate whereUserId($value)
 * @method static \Illuminate\Database\Query\Builder|\UserBillableRate whereBillableRateId($value)
 * @method static \Illuminate\Database\Query\Builder|\UserBillableRate whereStartDate($value)
 * @method static \Illuminate\Database\Query\Builder|\UserBillableRate whereEndDate($value)
 */
Class UserBillableRate extends Model
{
    protected $table='user_billable_rate';

    protected $dates = array('start_date', 'end_date');

    public function user()
    {
        return $this->belongsTo('\App\Models\Roster\User');
    }

    public function billablerate()
    {
        return $this->belongsTo('BillableRate');
    }

}