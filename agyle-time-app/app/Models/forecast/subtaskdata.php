<?php

// Model:'SubtaskData' - Database Table: 'subtask_data'

/**
 * SubtaskData
 *
 * @property string $identifier
 * @property integer $subtask_id
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property \Carbon\Carbon $start_time
 * @property \Carbon\Carbon $end_time
 * @property \Carbon\Carbon $time_to_kill
 * @property integer $organisation_id
 * @property integer $handle_time
 * @property string $agent_alias
 * @method static \SubtaskData compositeKey($identifier, $subtask_id)
 * @method static \Illuminate\Database\Query\Builder|\SubtaskData whereIdentifier($value)
 * @method static \Illuminate\Database\Query\Builder|\SubtaskData whereSubtaskId($value)
 * @method static \Illuminate\Database\Query\Builder|\SubtaskData whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\SubtaskData whereUpdatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\SubtaskData whereStartTime($value)
 * @method static \Illuminate\Database\Query\Builder|\SubtaskData whereEndTime($value)
 * @method static \Illuminate\Database\Query\Builder|\SubtaskData whereTimeToKill($value)
 * @method static \Illuminate\Database\Query\Builder|\SubtaskData whereOrganisationId($value)
 * @method static \Illuminate\Database\Query\Builder|\SubtaskData whereHandleTime($value)
 * @method static \Illuminate\Database\Query\Builder|\SubtaskData whereAgentAlias($value)
 */
Class SubtaskData extends \LaravelArdent\Ardent\Ardent
{
    protected $table='subtask_data';

    protected $connection = 'forecast_mysql';

    protected $primaryKey = 'identifier';

    public $incrementing = false;

    protected $dates = array('start_time', 'end_time');

    public function scopeCompositeKey($query, $identifier, $subtask_id) {
        return $query->where('identifier', '=', $identifier)->where('subtask_id', '=', $subtask_id);
    }
}