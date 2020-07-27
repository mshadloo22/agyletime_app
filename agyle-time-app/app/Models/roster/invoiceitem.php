<?php
use Illuminate\Database\Eloquent\Model;
/**
 * InvoiceItem
 *
 * @property integer $id
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property integer $invoice_id
 * @property integer $user_id
 * @property integer $billable_rate_id
 * @property integer $invoice_item_template_id
 * @property float $quantity
 * @property string $description
 * @property-read \Invoice $invoice
 * @property-read \User $user
 * @property-read \BillableRate $billablerate
 * @property-read \InvoiceItemTemplate $invoiceitemtemplate
 * @method static \Illuminate\Database\Query\Builder|\InvoiceItem whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\InvoiceItem whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\InvoiceItem whereUpdatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\InvoiceItem whereInvoiceId($value)
 * @method static \Illuminate\Database\Query\Builder|\InvoiceItem whereUserId($value)
 * @method static \Illuminate\Database\Query\Builder|\InvoiceItem whereBillableRateId($value)
 * @method static \Illuminate\Database\Query\Builder|\InvoiceItem whereInvoiceItemTemplateId($value)
 * @method static \Illuminate\Database\Query\Builder|\InvoiceItem whereQuantity($value)
 * @method static \Illuminate\Database\Query\Builder|\InvoiceItem whereDescription($value)
 */
Class InvoiceItem extends Model
{
    protected $table='invoice_item';

    public function invoice()
    {
        return $this->belongsTo('Invoice', 'invoice_id');
    }

    public function user()
    {
        return $this->belongsTo('\App\Models\Roster\User', 'user_id');
    }

    public function billablerate()
    {
        return $this->belongsTo('BillableRate', 'billable_rate_id');
    }

    public function invoiceitemtemplate()
    {
        return $this->belongsTo('InvoiceItemTemplate', 'invoice_item_template_id');
    }
}