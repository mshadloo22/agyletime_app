<?php
use Illuminate\Database\Eloquent\Model;
// Model:'TeamAvailSpec' - Database Table: 'Team_Avail_Spec'

/**
 * TeamAvailSpec
 *
 * @property integer $team_id
 * @property integer $availability_specific_id
 * @property string $notes
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property-read \Team $team
 * @property-read \AvailSpecific $availspecific
 * @method static \Illuminate\Database\Query\Builder|\TeamAvailSpec whereTeamId($value)
 * @method static \Illuminate\Database\Query\Builder|\TeamAvailSpec whereAvailabilitySpecificId($value)
 * @method static \Illuminate\Database\Query\Builder|\TeamAvailSpec whereNotes($value)
 * @method static \Illuminate\Database\Query\Builder|\TeamAvailSpec whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\TeamAvailSpec whereUpdatedAt($value)
 */
Class TeamAvailSpec extends Model
{

    protected $table='team_avail_spec';

    public function team()
    {
        return $this->belongsTo('Team');
    }

    public function availspecific()
    {
        return $this->belongsTo('AvailSpecific');
    }

}