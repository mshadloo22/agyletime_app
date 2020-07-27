<?php
use Illuminate\Database\Eloquent\Model;
// Model:'BillableRate' - Database Table: 'billable_rate'

/**
 * BillableRate
 *
 * @property integer $id
 * @property float $pay_rate
 * @property string $description
 * @property string $unit_type
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection|\UserBillableRate[] $userbillablerate
 * @property-read \Illuminate\Database\Eloquent\Collection|\User[] $user
 * @property float $billable_rate
 * @property-read \Illuminate\Database\Eloquent\Collection|\InvoiceItem[] $invoiceitem
 * @method static \Illuminate\Database\Query\Builder|\BillableRate whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\BillableRate whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\BillableRate whereUpdatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\BillableRate whereBillableRate($value)
 * @method static \Illuminate\Database\Query\Builder|\BillableRate whereDescription($value)
 * @method static \Illuminate\Database\Query\Builder|\BillableRate whereUnitType($value)
 */
Class BillableRate extends Model
{

    protected $table='billable_rate';

    protected $fillable = array('billable_rate', 'unit_type');

    public function userbillablerate()
    {
        return $this->belongsToMany('UserBillableRate');
    }

    public function user()
    {
        return $this->belongsToMany('\App\Models\Roster\User', 'user_billable_rate', 'billable_rate_id', 'user_id')->withPivot('start_date', 'end_date', 'id');
    }

    public function invoiceitem()
    {
        return $this->hasMany('InvoiceItem', 'billable_rate_id');
    }
}