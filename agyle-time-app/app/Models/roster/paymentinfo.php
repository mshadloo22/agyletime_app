<?php
use Illuminate\Database\Eloquent\Model;
// Model:'PaymentInfo' - Database Table: 'Payment_Info'

/**
 * PaymentInfo
 *
 * @property integer $id
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection|\Organisation[] $organisation
 * @method static \Illuminate\Database\Query\Builder|\PaymentInfo whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\PaymentInfo whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\PaymentInfo whereUpdatedAt($value)
 */
Class PaymentInfo extends Model
{

    protected $table='payment_info';

    public function organisation()
    {
        return $this->hasMany('Organisation');
    }

}