<?php
use \App\Helper\Helper;
use \App\Models\Roster\User;
use Carbon\Carbon;
class ShiftController extends BaseController
{
    public function __construct()
    {
        $this->beforeFilter('api_auth');
    }

    public function performance()
    {
        return View::make('performance_dashboard')
                   ->with('opening_hours', Helper::openingHoursArray());
    }
    
    public function postShiftData()
    {
        if(Input::has('user_id')) {
            Auth::loginUsingId(Input::get('user_id'));
        } else {
            $shift = RosteredShift::find(Input::get('shift_id'));
            Auth::loginUsingId($shift->user_id);
        }
        if (Input::has('shift_id'))
        {
            $shift_data = ShiftData::firstOrNew(array('shift_id' => Input::get('shift_id')));
        } else
        {
            return Helper::jsonLoader(INCORRECT_DATA);
        }

        if ($shift_data->save())
        {
            return Helper::jsonLoader(SUCCESS);
        } else
        {
            return Helper::jsonLoader(INCORRECT_DATA, $shift_data->errors()->all());
        }
    }
    /**
     * Used for getting the current scheduled shift for the user.
     *
     * If no parameters are given today's shift, with a 530 error if none is found.
     *
     * If create_shift is given as a parameter, will create a shift if none is there.
     *
     * Can accept a date parameter to return shifts from another day (will not create
     * shifts on other days, for sanity reasons)
     **/
    public function getScheduledShift()
    {

        if(Auth::check() && Auth::user()->primary_contact && Input::has('user_id')){
            Auth::loginUsingId(Input::get('user_id'));
        }

        $date = Input::has('date') ? new Carbon(Input::get('date'), Helper::organisationTimezone()) : new Carbon(Helper::organisationTimezone());

        $shift = RosteredShift::where('user_id', '=', Auth::user()->id)
                              ->where('date', '=', $date->toDateString())
                              ->with('task')
                              ->first(array('id', 'rostered_start_time', 'rostered_end_time'));


        if (isset($shift))
        {
            return Helper::jsonLoader(SUCCESS, $shift->toArray());
        } else if (Input::has('create_shift') && !Input::has('date'))
        {
            $start_date = $date->copy()->startOfWeek();
            $roster = Roster::firstOrNew(
                array(
                    'team_id' => Auth::user()->team_id,
                    'date_start' => $start_date->toDateString(),
                    'date_ending' => $start_date->endOfWeek()->toDateString()
                )
            );
            if (!$roster->exists)
            {
                $roster->roster_stage = 'pending';
                $roster->save();
            }

            $now = Carbon::now();
            $now->subMinutes($now->minute % 15);
            $now->second = 0;

            $shift = RosteredShift::create(
                array(
                    'date' => $date->toDateString(),
                    'rostered_start_time' => $now->toDateTimeString(),
                    'rostered_end_time' => $now->addHour()->toDateTimeString(),
                    'user_id' => Auth::user()->id,
                    'roster_id' => $roster->id
                )
            );
            $shift = RosteredShift::whereId($shift->id)
                ->with('task')
                ->first(array('id', 'rostered_start_time', 'rostered_end_time'));
            return Helper::jsonLoader(SUCCESS, $shift->toArray());
        } else
        {
            return Helper::jsonLoader(DATA_NOT_FOUND);
        }
    }

    public function postKeepAlive()
    {
        if (!Input::has('shift_id')) return Helper::jsonLoader(INCORRECT_DATA);

        try
        {
            ShiftData::where('organisation_id', '=', Auth::user()->organisation_id)
                     ->where('shift_id', '=', Input::get('shift_id'))
                     ->update(array('last_ping' => Carbon::now(), 'end_time' => '0000-00-00 00:00:00'));
        } catch (Exception $e)
        {
            return Helper::jsonLoader(EXCEPTION, array('code' => $e->getCode(), 'message' => $e->getMessage()));
        }

        return Helper::jsonLoader(SUCCESS);

    }

    public function getTeamShiftActivities()
    {
        if (!Input::has('team_id', 'date')) return Helper::jsonLoader(INCORRECT_DATA);
        $team_id = Input::get('team_id');
        $date = Input::get('date');
        $unscheduled_task_data = [];
        $workstream_data = [];

        $shifts = User::where('team_id', '=', $team_id)
                      ->where('active', '=', true)
                      ->with(array(
                          'rosteredshift' => function ($query) use ($date)
                          {
                              $query->where('date', '=', $date)
                                    ->with(array(
                                        'shiftdata',
                                        'shifttask' => function ($query)
                                        {
                                            $query->with(
                                                array(
                                                    'task',
                                                    'taskdata'
                                                )
                                            );
                                        }
                                    ));
                          },
                          'integration' => function ($query)
                          {
                              $query->whereIn('integrations.id', array(2, 3));
                          }))
                      ->get();

        foreach ($shifts as $shift)
        {
            if (!isset($shift->rosteredshift[0], $shift->rosteredshift[0]->shiftdata)) continue;

            $workstream_alias = null;
            $task_alias = null;
            $shift_start = $shift->rosteredshift[0]->shiftdata->start_time;
            $shift_end = ($shift->rosteredshift[0]->shiftdata->end_time !== '0000-00-00 00:00:00') ?
                $shift->rosteredshift[0]->shiftdata->end_time :
                Carbon::now()->toDateTimeString();
            $shift->rosteredshift[0]->shiftdata->start_time = Carbon::parse($shift->rosteredshift[0]->shiftdata->start_time, 'UTC')->tz(Helper::organisationTimezone());

            if($shift->rosteredshift[0]->shiftdata->end_time !== '0000-00-00 00:00:00') {
                $shift->rosteredshift[0]->shiftdata->end_time = Carbon::parse( $shift->rosteredshift[0]->shiftdata->end_time, 'UTC')->tz(Helper::organisationTimezone());
            } else {
                $shift->rosteredshift[0]->shiftdata->end_time = Carbon::now();
            }
            foreach ($shift->integration as $integration)
            {
                if ($integration->id == 2) $workstream_alias = json_decode($integration->pivot->configuration, true)['EmployeeAlias'];
                if ($integration->id == 3) $task_alias = json_decode($integration->pivot->configuration, true)['EmployeeAlias'];
            }

            if (isset($task_alias))
            {
                $unscheduled_task_data[$shift->id] = TaskData::whereAgentAlias($task_alias)
                                                             ->whereOrganisationId(Auth::user()->organisation_id)
                                                             ->whereBetween('start_time', array($shift_start, $shift_end))
                                                             ->where('shift_tasks_id', '=', 0)
                                                             ->get();

                $unscheduled_task_data[$shift->id] = $unscheduled_task_data[$shift->id]->toArray();
            }

            if (isset($workstream_alias))
            {
                $workstream_data[$shift->id] = WorkstreamData::whereAgentAlias($workstream_alias)
                                                             ->whereOrganisationId(Auth::user()->organisation_id)
                                                             ->whereBetween('start_time', array($shift_start, $shift_end))
                                                             ->get();

                $workstream_data[$shift->id] = $workstream_data[$shift->id]->toArray();
            }
        }

        $workstreams = Workstream::whereOrganisationId(Auth::user()->organisation_id)->get();
        $tasks = Task::whereOrganisationId(Auth::user()->organisation_id)->get();

        return Helper::jsonLoader(SUCCESS, ['users' => $shifts,
            'unscheduled_task_data' => $unscheduled_task_data,
            'workstream_data' => $workstream_data,
            'workstreams' => $workstreams->toArray(),
            'tasks' => $tasks->toArray(),
            'opening_hours' => Helper::openingHoursArray(true)]);
    }

    public function postTask()
    {
        $input = Input::all();

        if (!isset($input['task']['data']['type']))
            return Helper::jsonLoader(INCORRECT_DATA);

        if (isset($input['from'])) $from = Carbon::parse($input['from'], Helper::organisationTimezone())->timezone('UTC');
        if (isset($input['to'])) $to = Carbon::parse($input['to'], Helper::organisationTimezone())->timezone('UTC');
        $db_id = $input['task']['data']['db_id'];
        $changes = [];
        try
        {
            switch ($input['task']['data']['type'])
            {
                case 'shift':
                    if (isset($from)) $changes['rostered_start_time'] = $from;
                    if (isset($to)) $changes['rostered_end_time'] = $to;
                    RosteredShift::whereId($db_id)
                                 ->update($changes);
                    break;
                case 'shift-actual':
                    $shift_data = ShiftData::whereId($db_id)->first();
                    if (isset($from)) $shift_data->start_time = $from;
                    if (isset($to)) $shift_data->end_time = $to;
                    $shift_data->save();
                    break;
                case 'scheduled-task':
                    if (isset($from)) $changes['start_time'] = $from;
                    if (isset($to)) $changes['end_time'] = $to;
                    ShiftTask::whereId($db_id)
                             ->update($changes);
                    break;
                case 'scheduled-task-actual':
                    $task_data = TaskData::whereId($db_id)->first();
                    if (isset($from)) $task_data->start_time = $from;
                    if (isset($to)) $task_data->end_time = $to;
                    if ($task_data->start_time !== '0000-00-00 00:00:00' && $task_data->end_time !== '0000-00-00 00:00:00')
                    {
                        $task_data->handle_time = new CarbonRange($task_data->start_time, $task_data->end_time);
                        $task_data->handle_time = $task_data->handle_time->diff('seconds');
                    }
                    $task_data->save();
                    break;
                case 'exception':
                    if (isset($from)) $changes['start_time'] = $from;
                    if (isset($to)) $changes['end_time'] = $to;
                    if (isset($input['notes'])) $changes['notes'] = $input['notes'];
                    AdherenceException::whereId($db_id)
                                      ->update($changes);
                    break;
                default:
                    return Helper::jsonLoader(INCORRECT_DATA);
            }
        } catch (Exception $e)
        {
            return Helper::jsonLoader(EXCEPTION, ['code' => $e->getCode(), 'message' => $e->getMessage()]);
        }

        return Helper::jsonLoader(SUCCESS);
    }

    public function gantt_template()
    {
        return '<div class="gantt">
            <div class="gantt-labels"
                 ng-style="(labelsWidth > 0 && {\'width\': labelsWidth+\'px\'} || {})"
                 gantt-label-resizable="labelsWidth" resize-min="50">
                <div class="gantt-labels-head"
                     ng-show="gantt.columns.length > 0">
                    <div class="gantt-labels-head-row"
                         style="border-left: 1px lightgrey solid; border-top: 1px lightgrey solid;"
                         ng-style="{\'margin-top\': ((gantt.getActiveHeadersCount()-1)*2)+\'em\'}">
                        <span>Description</span>
                    </div>
                </div>
                <div class="gantt-labels-body"
                     ng-style="(maxHeight > 0 && {\'max-height\': maxHeight+\'px\'} || {})"
                     ng-show="gantt.columns.length > 0"
                     style="text-align:right;">
                    <div gantt-vertical-scroll-receiver
                         ng-style="{\'position\': \'relative\'}">
                        <div class="gantt-labels-row gantt-row-height"
                             ng-class-odd="\'gantt-background-row\'"
                             ng-class-even="\'gantt-background-row\'"
                             ng-repeat="row in gantt.rows"
                             style="overflow:visible; border-left: 1px lightgrey solid;"
                             ng-style="(row.order % 3 == 2 && {\'border-bottom\': \'1px lightgrey solid\'} || {})">
                            <gantt-sortable swap="swapRows(a,b)" active="allowRowSorting" ng-model="row">
                                <span>{{ row.description }}</span>
                            </gantt-sortable>
                        </div>
                    </div>
                </div>
            </div>
            <div class="gantt-head"
                 ng-show="gantt.columns.length > 0">
                <div gantt-horizontal-scroll-receiver
                     ng-style="{\'position\': \'relative\', \'width\': gantt.width+\'em\'}">
                    <div class="gantt-head-row"
                         ng-class="(gantt.headers.week !== undefined && \'gantt-head-row-bottom\' || \'\')"
                         ng-if="gantt.headers.month !== undefined">
                        <span ng-style="{\'width\': c.width+\'em\', \'left\': c.left+\'em\'}"
                              ng-repeat="c in gantt.headers.month | ganttColumnLimit:scroll_start:scroll_width">
                            {{ c.date | date:\'MMMM yyyy\' }}
                        </span>
                    </div>
                    <div class="gantt-head-row" ng-if="gantt.headers.week !== undefined">
                        <span ng-style="{\'width\': c.width+\'em\', \'left\': c.left+\'em\'}"
                              ng-repeat="c in gantt.headers.week | ganttColumnLimit:scroll_start:scroll_width">
                            {{ c.week }}
                        </span>
                    </div>
                    <div class="gantt-head-row" ng-if="gantt.headers.day !== undefined">
                        <span ng-style="{\'width\': c.width+\'em\', \'left\': c.left+\'em\', \'background-color\':(((c.date | date: \'dd\') % 2 == 0) ? \'#D1D1D1\' : \'#DBDBDB\')}"
                              ng-repeat="c in gantt.headers.day | ganttColumnLimit:scroll_start:scroll_width">
                            Employee Adherence
                        </span>
                    </div>
                    <div class="gantt-head-row" ng-if="gantt.headers.hour !== undefined">
                        <span ng-style="{\'width\': c.width+\'em\', \'left\': c.left+\'em\'}"
                              ng-repeat="c in gantt.headers.hour | ganttColumnLimit:scroll_start:scroll_width">
                            {{ c.date | date:\'HH\' }}
                        </span>
                    </div>
                </div>
            </div>
            <div class="gantt-scrollable"
                 gantt-scroll-sender
                 gantt-limit-updater
                 ng-style="(maxHeight > 0 && {\'max-height\': maxHeight+\'px\', \'overflow-y\': \'scroll\'} || {\'overflow-y\': \'hidden\'})"
                 ng-style="{\'overflow-x\': (gantt.rows.length == 0 && \'hidden\' || \'scroll\')}">
                <div class="gantt-body"
                     ng-style="{\'width\': gantt.width+\'em\'}">
                    <div class="gantt-body-background gantt-row-height">
                        <div ng-class-odd="\'gantt-background-row\'"
                             ng-class-even="\'gantt-background-row-alt\'"
                             ng-repeat="row in gantt.rows">
                        </div>
                    </div>
                    <div class="gantt-body-foreground">
                        <div ng-class="(viewScale === \'hour\' && !c.isWorkHour && \'gantt-foreground-col-nonworkhour\' || (c.isWeekend && \'gantt-foreground-col-weekend\' || \'gantt-foreground-col\'))"
                             ng-style="{\'width\': c.width+\'em\', \'left\': c.left+\'em\'}"
                             ng-repeat="c in gantt.columns | ganttColumnLimit:scroll_start:scroll_width">
                        </div>
                    </div>
                    <div class="gantt-body-content">
                        <div class="gantt-row gantt-row-height"
                             ng-click="raiseDOMRowClickedEvent($event, row)"
                             ng-repeat="row in gantt.rows track by row.id"
                             ng-class="{\'add-bottom-margin\': $last }">
                             >
                            <!--a task will override the row event -->
                            <div ng-class="(task.isMilestone === true && \'gantt-task-milestone\' || \'gantt-task\')"
                                 ng-style="{\'left\': task.left +\'em\', \'width\': task.width +\'em\', \'z-index\': (task.isMoving === true && 1 || \'\'), \'background-color\': task.color}"
                                 ng-click="raiseDOMTaskClickedEvent($event, task)"
                                 ng-repeat="task in row.tasks | ganttTaskLimit:scroll_start:scroll_width track by task.id"
                                 gantt-task-moveable>
                                <gantt-tooltip ng-model="task">
                                    <div class="gantt-task-content"><span></span></div>
                                </gantt-tooltip>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>';
    }
}