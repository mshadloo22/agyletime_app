<?php
use Illuminate\Database\Eloquent\Model;
/**
 * InvoiceTemplate
 *
 * @property integer $id
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property integer $invoice_calendar_id
 * @property integer $organisation_id
 * @property integer $integration_id
 * @property string $branding_theme
 * @property string $contact
 * @property boolean $tax_included
 * @property string $reference_template
 * @property string $status
 * @property string $name
 * @property integer $issued_date_offset
 * @property \Carbon\Carbon $next_run_date
 * @property-read \InvoiceCalendar $invoicecalendar
 * @property-read \Organisation $organisation
 * @property-read \Integrations $integrations
 * @property-read \Illuminate\Database\Eloquent\Collection|\InvoiceItemTemplate[] $invoiceitemtemplate
 * @property-read \Illuminate\Database\Eloquent\Collection|\Invoice[] $invoice
 * @method static \Illuminate\Database\Query\Builder|\InvoiceTemplate whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\InvoiceTemplate whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\InvoiceTemplate whereUpdatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\InvoiceTemplate whereInvoiceCalendarId($value)
 * @method static \Illuminate\Database\Query\Builder|\InvoiceTemplate whereOrganisationId($value)
 * @method static \Illuminate\Database\Query\Builder|\InvoiceTemplate whereIntegrationId($value)
 * @method static \Illuminate\Database\Query\Builder|\InvoiceTemplate whereBrandingTheme($value)
 * @method static \Illuminate\Database\Query\Builder|\InvoiceTemplate whereContact($value)
 * @method static \Illuminate\Database\Query\Builder|\InvoiceTemplate whereTaxIncluded($value)
 * @method static \Illuminate\Database\Query\Builder|\InvoiceTemplate whereReferenceTemplate($value)
 * @method static \Illuminate\Database\Query\Builder|\InvoiceTemplate whereStatus($value)
 * @method static \Illuminate\Database\Query\Builder|\InvoiceTemplate whereName($value)
 * @method static \Illuminate\Database\Query\Builder|\InvoiceTemplate whereIssuedDateOffset($value)
 * @method static \Illuminate\Database\Query\Builder|\InvoiceTemplate whereNextRunDate($value)
 * @method static \InvoiceTemplate getInvoiceItemTemplate($getItemTemplate)
 * @method static \InvoiceTemplate getInvoice($getInvoice)
 */
Class InvoiceTemplate extends Model
{
    protected $table='invoice_template';

    protected $fillable = array('name', 'invoice_calendar_id', 'organisation_id', 'integration_id', 'branding_theme',
        'contact', 'reference_template', 'tax_included', 'status', 'issued_date_offset', 'next_run_date');

    public $autoPurgeRedundantAttributes = true;

    public static $rules = array(
        'name' => 'required',
        'invoice_calendar_id' => 'required|integer|exists:invoice_calendar,id',
        'organisation_id' => 'required|integer|exists:organisation,id',
        'integration_id' => 'required|integer|exists:integrations,id',
        'branding_theme' => 'required|exists:org_integration_config_option,identifier',
        'contact' => 'required|exists:org_integration_config_option,identifier',
        'reference_template' => 'sometimes',
        'tax_included' => 'required|boolean',
        'status' => 'required',
        'issued_date_offset' => 'required',
        'next_run_date' => 'required'
    );

    protected $dates = array('next_run_date');

    function __construct($attributes = array()) {
        parent::__construct($attributes);

        $this->purgeFilters[] = function($key) {
            $purge = array_keys(self::$rules);
            $purge[] = ['id'];
            return in_array($key, $purge);
        };
    }

    public function invoicecalendar()
    {
        return $this->belongsTo('InvoiceCalendar', 'invoice_calendar_id');
    }

    public function organisation()
    {
        return $this->belongsTo('Organisation', 'organisation_id');
    }

    public function integrations()
    {
        return $this->belongsTo('Integrations', 'integration_id');
    }

    public function invoiceitemtemplate()
    {
        return $this->hasMany('InvoiceItemTemplate', 'invoice_template_id');
    }

    public function invoice()
    {
        return $this->hasMany('Invoice', 'invoice_template_id');
    }

    public function scopeGetInvoiceItemTemplate($query, $getItemTemplate)
    {
        if($getItemTemplate) return $query->with('InvoiceItemTemplate');
    }

    public function scopeGetInvoice($query, $getInvoice)
    {
        if($getInvoice) return $query->with('Invoice');
    }
}