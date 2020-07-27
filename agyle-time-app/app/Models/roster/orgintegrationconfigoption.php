<?php
use Illuminate\Database\Eloquent\Model;
/**
 * OrgIntegrationConfigOption
 *
 * @property integer $id
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property integer $org_integration_config_id
 * @property string $identifier
 * @property string $option
 * @property-read \OrgIntegrationConfig $orgintegrationconfig
 * @method static \Illuminate\Database\Query\Builder|\OrgIntegrationConfigOption whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\OrgIntegrationConfigOption whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\OrgIntegrationConfigOption whereUpdatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\OrgIntegrationConfigOption whereOrgIntegrationConfigId($value)
 * @method static \Illuminate\Database\Query\Builder|\OrgIntegrationConfigOption whereIdentifier($value)
 * @method static \Illuminate\Database\Query\Builder|\OrgIntegrationConfigOption whereOption($value)
 */
Class OrgIntegrationConfigOption extends Model
{
    protected $table = "org_integration_config_option";

    public $autoHydrateEntityFromInput = true;

    public $forceEntityHydrateFromInput = true;

    protected $fillable = array('org_integration_config_id', 'identifier', 'option');

    public function orgintegrationconfig()
    {
        return $this->belongsTo('OrgIntegrationConfig', 'org_integration_config_id');
    }
}