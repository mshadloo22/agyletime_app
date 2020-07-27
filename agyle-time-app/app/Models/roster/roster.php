<?php
use Illuminate\Database\Eloquent\Model;
// Model:'Roster' - Database Table: 'Roster'

/**
 * Roster
 *
 * @property integer $id
 * @property integer $team_id
 * @property \Carbon\Carbon $date_start
 * @property \Carbon\Carbon $date_ending
 * @property string $roster_stage
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property string $notes
 * @property-read \Illuminate\Database\Eloquent\Collection|\RosterComments[] $rostercomments
 * @property-read \Illuminate\Database\Eloquent\Collection|\RosterEditableBy[] $rostereditableby
 * @property-read \Illuminate\Database\Eloquent\Collection|\RosteredShift[] $rosteredshift
 * @property-read \Team $team
 * @method static \Illuminate\Database\Query\Builder|\Roster whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\Roster whereTeamId($value)
 * @method static \Illuminate\Database\Query\Builder|\Roster whereDateStart($value)
 * @method static \Illuminate\Database\Query\Builder|\Roster whereDateEnding($value)
 * @method static \Illuminate\Database\Query\Builder|\Roster whereRosterStage($value)
 * @method static \Illuminate\Database\Query\Builder|\Roster whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\Roster whereUpdatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\Roster whereNotes($value)
 */
Class Roster extends Model
{
    protected $table='roster';

    protected $dates = array('date_start', 'date_ending');

    protected $guarded = array('id');

    public function rostercomments()
    {
        return $this->belongsToMany('RosterComments');
    }
    public function rostereditableby()
    {
        return $this->belongsToMany('RosterEditableBy');
    }
    public function rosteredshift()
    {
        return $this->hasMany('RosteredShift');
    }
    public function team()
    {
        return $this->belongsTo('Team');
    }

}