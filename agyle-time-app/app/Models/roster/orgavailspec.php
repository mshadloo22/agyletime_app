<?php
use Illuminate\Database\Eloquent\Model;
// Model:'OrgAvailSpec' - Database Table: 'Org_Avail_Spec'

/**
 * OrgAvailSpec
 *
 * @property integer $organisation_id
 * @property integer $availability_specific_id
 * @property string $notes
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property-read \Organisation $organisation
 * @property-read \AvailSpecific $availspecific
 * @method static \Illuminate\Database\Query\Builder|\OrgAvailSpec whereOrganisationId($value)
 * @method static \Illuminate\Database\Query\Builder|\OrgAvailSpec whereAvailabilitySpecificId($value)
 * @method static \Illuminate\Database\Query\Builder|\OrgAvailSpec whereNotes($value)
 * @method static \Illuminate\Database\Query\Builder|\OrgAvailSpec whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\OrgAvailSpec whereUpdatedAt($value)
 */
Class OrgAvailSpec extends Model
{

    protected $table='org_avail_spec';

    public function organisation()
    {
        return $this->belongsTo('Organisation');
    }

    public function availspecific()
    {
        return $this->belongsTo('AvailSpecific');
    }

}