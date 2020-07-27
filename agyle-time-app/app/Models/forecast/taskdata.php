<?php

// Model:'TaskData' - Database Table: 'task_data'

/**
 * TaskData
 *
 * @property integer $id
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property \Carbon\Carbon $start_time
 * @property \Carbon\Carbon $end_time
 * @property integer $task_id
 * @property integer $organisation_id
 * @property integer $handle_time
 * @property string $agent_alias
 * @property string $identifier
 * @property integer $shift_tasks_id
 * @method static \Illuminate\Database\Query\Builder|\TaskData whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\TaskData whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\TaskData whereUpdatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\TaskData whereStartTime($value)
 * @method static \Illuminate\Database\Query\Builder|\TaskData whereEndTime($value)
 * @method static \Illuminate\Database\Query\Builder|\TaskData whereTaskId($value)
 * @method static \Illuminate\Database\Query\Builder|\TaskData whereOrganisationId($value)
 * @method static \Illuminate\Database\Query\Builder|\TaskData whereHandleTime($value)
 * @method static \Illuminate\Database\Query\Builder|\TaskData whereAgentAlias($value)
 * @method static \Illuminate\Database\Query\Builder|\TaskData whereIdentifier($value)
 * @method static \Illuminate\Database\Query\Builder|\TaskData whereShiftTasksId($value)
 */
Class TaskData extends \LaravelArdent\Ardent\Ardent
{
    protected $table = 'task_data';

    protected $connection = 'forecast_mysql';

    protected $dates = array('start_time', 'end_time');
}