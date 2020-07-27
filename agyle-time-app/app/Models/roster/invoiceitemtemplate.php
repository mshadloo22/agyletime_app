<?php
use Illuminate\Database\Eloquent\Model;
/**
 * InvoiceItemTemplate
 *
 * @property integer $id
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property integer $team_id
 * @property integer $invoice_template_id
 * @property string $account
 * @property string $tracking
 * @property string $description_template
 * @property string $tax_rate
 * @property-read \Team $team
 * @property-read \InvoiceTemplate $invoicetemplate
 * @property-read \Illuminate\Database\Eloquent\Collection|\InvoiceItem[] $invoiceitem
 * @method static \Illuminate\Database\Query\Builder|\InvoiceItemTemplate whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\InvoiceItemTemplate whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\InvoiceItemTemplate whereUpdatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\InvoiceItemTemplate whereTeamId($value)
 * @method static \Illuminate\Database\Query\Builder|\InvoiceItemTemplate whereInvoiceTemplateId($value)
 * @method static \Illuminate\Database\Query\Builder|\InvoiceItemTemplate whereAccount($value)
 * @method static \Illuminate\Database\Query\Builder|\InvoiceItemTemplate whereTracking($value)
 * @method static \Illuminate\Database\Query\Builder|\InvoiceItemTemplate whereDescriptionTemplate($value)
 * @method static \Illuminate\Database\Query\Builder|\InvoiceItemTemplate whereTaxRate($value)
 */
Class InvoiceItemTemplate extends Model
{
    protected $table='invoice_item_template';

    protected $fillable = array('team_id', 'invoice_template_id', 'account', 'tracking', 'description_template', 'tax_rate');

    public static $rules = array(
        'team_id' => 'required|integer|exists:team,id',
        'invoice_template_id' => 'required|integer|exists:invoice_template,id',
        'account' => 'required|exists:org_integration_config_option,identifier',
        'tracking' => 'sometimes',
        'description_template' => 'sometimes',
        'tax_rate' => 'sometimes',
    );

    function __construct($attributes = array()) {
        parent::__construct($attributes);

        $this->purgeFilters[] = function($key) {
            $purge = array_keys(self::$rules);
            $purge[] = ['id'];
            return in_array($key, $purge);
        };
    }

    public function getTrackingAttributes($value)
    {
        return json_decode($value);
    }

    public function setTrackingAttributes($value)
    {
        $this->attributes['tracking'] = json_encode($value);
    }

    public function team()
    {
        return $this->belongsTo('Team', 'team_id');
    }

    public function invoicetemplate()
    {
        return $this->belongsTo('InvoiceTemplate', 'invoice_template_id');
    }

    public function invoiceitem()
    {
        return $this->hasMany('InvoiceItem', 'invoice_item_template_id');
    }
}