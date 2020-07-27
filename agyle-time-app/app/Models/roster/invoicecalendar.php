<?php
use Illuminate\Database\Eloquent\Model;
/**
 * InvoiceCalendar
 *
 * @property integer $id
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property \Carbon\Carbon $start_date
 * @property string $period
 * @property-read \Illuminate\Database\Eloquent\Collection|\InvoiceTemplate[] $invoicetemplate
 * @method static \Illuminate\Database\Query\Builder|\InvoiceCalendar whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\InvoiceCalendar whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\InvoiceCalendar whereUpdatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\InvoiceCalendar whereStartDate($value)
 * @method static \Illuminate\Database\Query\Builder|\InvoiceCalendar wherePeriod($value)
 */
Class InvoiceCalendar extends Model
{
    protected $table='invoice_calendar';

    protected $guarded = array('id');

    protected $dates = array('start_date');

    public function invoicetemplate()
    {
        return $this->hasMany('InvoiceTemplate', 'invoice_calendar_id');
    }
}