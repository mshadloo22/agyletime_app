<?php
use Illuminate\Database\Eloquent\Model;
/**
 * Invoice
 *
 * @property integer $id
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property integer $invoice_template_id
 * @property integer $organisation_id
 * @property \Carbon\Carbon $start_date
 * @property \Carbon\Carbon $end_date
 * @property \Carbon\Carbon $issued_date
 * @property string $reference
 * @property string $status
 * @property boolean $tax_included
 * @property boolean $sent
 * @property-read \InvoiceTemplate $invoicetemplate
 * @property-read \Organisation $organisation
 * @property-read \Illuminate\Database\Eloquent\Collection|\InvoiceItem[] $invoiceitem
 * @method static \Illuminate\Database\Query\Builder|\Invoice whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\Invoice whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\Invoice whereUpdatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\Invoice whereInvoiceTemplateId($value)
 * @method static \Illuminate\Database\Query\Builder|\Invoice whereOrganisationId($value)
 * @method static \Illuminate\Database\Query\Builder|\Invoice whereStartDate($value)
 * @method static \Illuminate\Database\Query\Builder|\Invoice whereEndDate($value)
 * @method static \Illuminate\Database\Query\Builder|\Invoice whereIssuedDate($value)
 * @method static \Illuminate\Database\Query\Builder|\Invoice whereReference($value)
 * @method static \Illuminate\Database\Query\Builder|\Invoice whereStatus($value)
 * @method static \Illuminate\Database\Query\Builder|\Invoice whereTaxIncluded($value)
 * @method static \Illuminate\Database\Query\Builder|\Invoice whereSent($value)
 */
Class Invoice extends Model
{
    protected $table='invoice';

    public function invoicetemplate()
    {
        return $this->belongsTo('InvoiceTemplate', 'invoice_template_id');
    }

    public function organisation()
    {
        return $this->belongsTo('Organisation', 'organisation_id');
    }

    public function invoiceitem()
    {
        return $this->hasMany('InvoiceItem', 'invoice_id');
    }

}
