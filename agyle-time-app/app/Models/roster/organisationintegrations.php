<?php
use Illuminate\Database\Eloquent\Model;
/**
 * OrganisationIntegration
 *
 * @property integer $id
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property integer $integration_id
 * @property integer $organisation_id
 * @property string $configuration
 * @property-read \Organisation $organisation
 * @property-read \Integration $integration
 * @property-read \Illuminate\Database\Eloquent\Collection|\OrgIntegrationConfig[] $orgintegrationconfig
 * @method static \Illuminate\Database\Query\Builder|\OrganisationIntegration whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\OrganisationIntegration whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\OrganisationIntegration whereUpdatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\OrganisationIntegration whereIntegrationId($value)
 * @method static \Illuminate\Database\Query\Builder|\OrganisationIntegration whereOrganisationId($value)
 * @method static \Illuminate\Database\Query\Builder|\OrganisationIntegration whereConfiguration($value)
 */
Class OrganisationIntegration extends Model
{
    protected $table='organisation_integrations';

    protected $fillable = array('organisation_id', 'integration_id', 'configuration');

    public function organisation()
    {
        return $this->belongsTo('Organisation');
    }

    public function integration()
    {
        return $this->belongsTo('Integration');
    }

    public function orgintegrationconfig()
    {
        return $this->hasMany('OrgIntegrationConfig', 'organisation_integrations_id');
    }
}
