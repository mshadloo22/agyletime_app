<?php
use Illuminate\Database\Eloquent\Model;
// Model:'TeamAvailGen' - Database Table: 'Team_Avail_Gen'

/**
 * TeamAvailGen
 *
 * @property integer $team_id
 * @property integer $availability_general_id
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property-read \Team $team
 * @property-read \AvailGeneral $availgeneral
 * @method static \Illuminate\Database\Query\Builder|\TeamAvailGen whereTeamId($value)
 * @method static \Illuminate\Database\Query\Builder|\TeamAvailGen whereAvailabilityGeneralId($value)
 * @method static \Illuminate\Database\Query\Builder|\TeamAvailGen whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\TeamAvailGen whereUpdatedAt($value)
 */
Class TeamAvailGen extends Model
{

    protected $table='team_avail_gen';

    public function team()
    {
        return $this->belongsTo('Team');
    }

    public function availgeneral()
    {
        return $this->belongsTo('AvailGeneral');
    }

}