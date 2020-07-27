<?php

// Model:'Organisation' - Database Table: 'Organisation'
use Illuminate\Database\Eloquent\Model;

/**
 * Organisation
 *
 * @property integer $id
 * @property string $name
 * @property string $business_registration
 * @property string $address
 * @property string $post_code
 * @property integer $city_id
 * @property string $phone
 * @property string $email
 * @property integer $plan_id
 * @property integer $payment_info_id
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property string $api_token
 * @property string $subdomain
 * @property boolean $setup_wizard_complete
 * @property-read \Illuminate\Database\Eloquent\Collection|\OrgAvailGenRelatedByOrganisationId[] $orgavailgenRelatedByOrganisationId
 * @property-read \Illuminate\Database\Eloquent\Collection|\OrgAvailSpec[] $orgavailspec
 * @property-read \Illuminate\Database\Eloquent\Collection|\Role[] $role
 * @property-read \Illuminate\Database\Eloquent\Collection|\Task[] $task
 * @property-read \Illuminate\Database\Eloquent\Collection|\Team[] $team
 * @property-read \Illuminate\Database\Eloquent\Collection|\User[] $user
 * @property-read \Illuminate\Database\Eloquent\Collection|\Workstream[] $workstream
 * @property-read \City $city
 * @property-read \PaymentInfo $paymentinfo
 * @property-read \Plan $plan
 * @property-read \Illuminate\Database\Eloquent\Collection|\AvailGeneral[] $availgeneral
 * @property-read \Illuminate\Database\Eloquent\Collection|\Integration[] $integration
 * @property-read \Illuminate\Database\Eloquent\Collection|\Invoice[] $invoice
 * @property-read \Illuminate\Database\Eloquent\Collection|\InvoiceTemplate[] $invoicetemplate
 * @method static \Illuminate\Database\Query\Builder|\Organisation whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\Organisation whereName($value)
 * @method static \Illuminate\Database\Query\Builder|\Organisation whereBusinessRegistration($value)
 * @method static \Illuminate\Database\Query\Builder|\Organisation whereAddress($value)
 * @method static \Illuminate\Database\Query\Builder|\Organisation wherePostCode($value)
 * @method static \Illuminate\Database\Query\Builder|\Organisation whereCityId($value)
 * @method static \Illuminate\Database\Query\Builder|\Organisation wherePhone($value)
 * @method static \Illuminate\Database\Query\Builder|\Organisation whereEmail($value)
 * @method static \Illuminate\Database\Query\Builder|\Organisation wherePlanId($value)
 * @method static \Illuminate\Database\Query\Builder|\Organisation wherePaymentInfoId($value)
 * @method static \Illuminate\Database\Query\Builder|\Organisation whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\Organisation whereUpdatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\Organisation whereApiToken($value)
 * @method static \Illuminate\Database\Query\Builder|\Organisation whereSubdomain($value)
 * @method static \Illuminate\Database\Query\Builder|\Organisation whereSetupWizardComplete($value)
 * @property-read \Illuminate\Database\Eloquent\Collection|\Partner[] $partner
 * @property-read \Illuminate\Database\Eloquent\Collection|\Site[] $site
 * @property-read \Illuminate\Database\Eloquent\Collection|\ConfigPriority[] $configpriority
 */
Class Organisation extends Model
{

    protected $table = 'organisation';

    public function orgavailgenRelatedByOrganisationId()
    {
        return $this->hasMany('OrgAvailGenRelatedByOrganisationId');
    }

    public function orgavailspec()
    {
        return $this->belongsToMany('OrgAvailSpec');
    }

    public function role()
    {
        return $this->hasMany('Role');
    }

    public function task()
    {
        return $this->hasMany('Task');
    }

    public function team()
    {
        return $this->hasMany('Team');
    }

    public function user()
    {
        return $this->hasMany('\App\Models\Roster\User');
    }

    public function workstream()
    {
        return $this->hasMany('Workstream');
    }

    public function city()
    {
        return $this->belongsTo('City');
    }

    public function paymentinfo()
    {
        return $this->belongsTo('PaymentInfo');
    }

    public function plan()
    {
        return $this->belongsTo('Plan');
    }

    public function availgeneral()
    {
        return $this->belongsToMany('AvailGeneral', 'org_avail_gen', 'organisation_id', 'availability_general_id')->withTimestamps();
    }

    public function integration()
    {
        return $this->belongsToMany('Integration', 'organisation_integrations', 'organisation_id', 'integration_id')->withTimestamps()->withPivot('configuration');
    }

    public function invoice()
    {
        return $this->hasMany('Invoice', 'organisation_id');
    }

    public function roster()
    {
        return $this->hasManyThrough('Roster', 'Team');
    }

    public function invoicetemplate()
    {
        return $this->hasMany('InvoiceTemplate', 'organisation_id');
    }

    public function partner()
    {
        return $this->hasMany('Partner');
    }

    public function site()
    {
        return $this->hasMany('Site');
    }

    public function configpriority()
    {
        return $this->morphMany('ConfigPriority', 'configurable');
    }

    public function features()
    {
        return $this->belongsToMany('\App\Models\Roster\Feature', 'org_features', 'organisation_id', 'feature_id')->withPivot('enabled')->withTimestamps();
    }

    /**
     * Check if this feature enabled
     * @param $feature_key
     * @return is_this_feature_enabled
     */
    public function can($feature_key)
    {
        $feature = $this
            ->features()
            ->where('feature_key', '=', $feature_key)
            ->first();
        return $feature->pivot->enabled;
//       $this->features()->sync([$feature->id => ['enabled' => true]], false); //This is to enable
    }

    /**
     * Fetch all feature enablements for this org
     * @return array
     */
    public function canAll() {
        $results = [];
        $features = $this->features()->get();
        foreach($features as $feature) {
            $enabled = $feature->pivot->enabled;
            $feature->enabled = $enabled;
            array_push($results, $feature);
        }
        return $results;
    }


}