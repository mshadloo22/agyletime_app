<?php
use Illuminate\Database\Eloquent\Model;
/**
 * OrgIntegrationConfig
 *
 * @property integer $id
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property integer $organisation_integrations_id
 * @property string $option_key
 * @property string $value
 * @property-read \OrganisationIntegration $organisationintegration
 * @property-read \Illuminate\Database\Eloquent\Collection|\OrgIntegrationConfigOption[] $orgintegrationconfigoption
 * @method static \Illuminate\Database\Query\Builder|\OrgIntegrationConfig whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\OrgIntegrationConfig whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\OrgIntegrationConfig whereUpdatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\OrgIntegrationConfig whereOrganisationIntegrationsId($value)
 * @method static \Illuminate\Database\Query\Builder|\OrgIntegrationConfig whereOptionKey($value)
 * @method static \Illuminate\Database\Query\Builder|\OrgIntegrationConfig whereValue($value)
 */
Class OrgIntegrationConfig extends Model
{
    protected $table = "org_integration_config";

    protected $fillable = array('option_key', 'options', 'value', 'organisation_integrations_id');

    public function organisationintegration()
    {
        return $this->belongsTo('OrganisationIntegration', 'organisation_integrations_id');
    }

    public function orgintegrationconfigoption()
    {
        return $this->hasMany('OrgIntegrationConfigOption', 'org_integration_config_id');
    }
}