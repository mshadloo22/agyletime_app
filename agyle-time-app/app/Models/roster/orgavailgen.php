<?php
use Illuminate\Database\Eloquent\Model;
// Model:'OrgAvailGen' - Database Table: 'Org_Avail_Gen'

/**
 * OrgAvailGen
 *
 * @property integer $organisation_id
 * @property integer $availability_general_id
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property-read \Organisation $organisation
 * @property-read \AvailGeneral $availgeneral
 * @method static \Illuminate\Database\Query\Builder|\OrgAvailGen whereOrganisationId($value)
 * @method static \Illuminate\Database\Query\Builder|\OrgAvailGen whereAvailabilityGeneralId($value)
 * @method static \Illuminate\Database\Query\Builder|\OrgAvailGen whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\OrgAvailGen whereUpdatedAt($value)
 */
Class OrgAvailGen extends Model
{

    protected $table='org_avail_gen';

    public function organisation()
    {
        return $this->belongsTo('Organisation');
    }

    public function availgeneral()
    {
        return $this->belongsTo('AvailGeneral', 'availability_general_id');
    }

}