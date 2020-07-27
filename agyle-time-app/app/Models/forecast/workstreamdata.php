<?php

// Model:'WorkstreamData' - Database Table: 'workstream_data'

/**
 * WorkstreamData
 *
 * @property string $identifier
 * @property integer $workstream_id
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property \Carbon\Carbon $start_time
 * @property \Carbon\Carbon $end_time
 * @property \Carbon\Carbon $time_to_kill
 * @property integer $organisation_id
 * @property integer $wait_time
 * @property integer $handle_time
 * @property string $agent_alias
 * @property boolean $under_threshold
 * @method static \WorkstreamData compositeKey($identifier, $workstream_id)
 * @method static \Illuminate\Database\Query\Builder|\WorkstreamData whereIdentifier($value)
 * @method static \Illuminate\Database\Query\Builder|\WorkstreamData whereWorkstreamId($value)
 * @method static \Illuminate\Database\Query\Builder|\WorkstreamData whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\WorkstreamData whereUpdatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\WorkstreamData whereStartTime($value)
 * @method static \Illuminate\Database\Query\Builder|\WorkstreamData whereEndTime($value)
 * @method static \Illuminate\Database\Query\Builder|\WorkstreamData whereTimeToKill($value)
 * @method static \Illuminate\Database\Query\Builder|\WorkstreamData whereOrganisationId($value)
 * @method static \Illuminate\Database\Query\Builder|\WorkstreamData whereWaitTime($value)
 * @method static \Illuminate\Database\Query\Builder|\WorkstreamData whereHandleTime($value)
 * @method static \Illuminate\Database\Query\Builder|\WorkstreamData whereAgentAlias($value)
 * @method static \Illuminate\Database\Query\Builder|\WorkstreamData whereUnderThreshold($value)
 */
Class WorkstreamData extends \LaravelArdent\Ardent\Ardent
{
    protected $table = 'workstream_data';

    protected $connection = 'forecast_mysql';

    protected $primaryKey = 'identifier';

    public $incrementing = false;

    protected $dates = array('start_time', 'end_time', 'time_to_kill');

    public function scopeCompositeKey($query, $identifier, $workstream_id) {
        return $query->where('identifier', '=', $identifier)->where('workstream_id', '=', $workstream_id);
    }
}