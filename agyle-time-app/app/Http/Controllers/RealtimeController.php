<?php
use \App\Helper\Helper;
use \App\Models\Roster\User;
use Carbon\Carbon;
use App\Helper\CarbonRange;

class RealtimeController extends BaseController
{

    public function __construct()
    {
        $this->beforeFilter('api_auth');
    }

    public function adherence()
    {
        return View::make('adherence_dashboard')
            ->with('opening_hours', Helper::openingHoursArray());
    }

    public function getRealtimeSetup()
    {
        $input = Input::all();
        if (isset($input['team_id'])) {
            $team_id = $input['team_id'];
        } else {
            return Helper::jsonLoader(INCORRECT_DATA);
        }

        $day_time = new Carbon(Helper::organisationTimezone());
        $day_time->startOfDay()->timezone(Config::get('app.timezone'));

        $team = Team::where('id', '=', $team_id)->with(array('user' => function ($query) {
            $query->where('active', '=', true)
                ->with(array('integration' => function ($query) {
                    $query->whereIn('integration_id', array(2, 3));
                }
                ));
        }))
            ->first();
        $team_stats = WorkstreamData::select(DB::raw('avg(handle_time) as handle_time, avg(wait_time) as wait_time, workstream_id'))
            ->where('organisation_id', '=', $team->organisation_id)
            ->where('start_time', '>=', Carbon::now()->subHour()->toDateTimeString())
            ->groupBy('workstream_id')
            ->get();

        $adherence_scores = $this->calcTeamAdherence($input['team_id'], Carbon::now(Helper::organisationTimezone())->toDateString(), true);

        $team = $team->toArray();

        foreach ($team['user'] as $key => $user) {
            $task_array = [];
            $current_task = null;

            $shift_data = ShiftData::where('agent_alias', '=', $user['id'])
                ->where('start_time', '>=', $day_time->toDateTimeString())
                ->first();

            foreach ($user['integration'] as $integration) {
                if (isset($integration['pivot']) && $integration['name'] == 'CTI') {
                    $agent_alias = json_decode($integration['pivot']['configuration'], true)['EmployeeAlias'];
                    $task_data = TaskData::where('agent_alias', '=', $agent_alias)
                        ->where('organisation_id', '=', Auth::user()->organisation_id)
                        ->where('start_time', '>=', $day_time->toDateTimeString())
                        ->orderBy('updated_at', 'asc')
                        ->get();
                    foreach ($task_data as $task) {
                        $task_id = "task-$task->task_id";

                        if (!isset($task_array[$task_id])) {
                            $task_array[$task_id]['total_time_spent'] = $task->handle_time;
                            $task_array[$task_id]['total_times_completed'] = 1;
                        } else {
                            $task_array[$task_id]['total_time_spent'] += $task->handle_time;
                            $task_array[$task_id]['total_times_completed']++;
                        }
                        $data = $task_data->last();

                        if (!isset($current_task) || $current_task['updated_at']->lt($data->updated_at)) {
                            $current_task['id'] = "task-$data->task_id";
                            $current_task['start_time'] = $data->start_time instanceOf DateTime ? $data->start_time->timezone(Helper::organisationTimezone())->toDateTimeString() : $data->start_time;
                            $current_task['end_time'] = $data->end_time instanceOf DateTime ? $data->end_time->timezone(Helper::organisationTimezone())->toDateTimeString() : $data->end_time;
                            $current_task['updated_at'] = $data->updated_at;
                            $current_task['completed'] = ($data->end_time != '0000-00-00 00:00:00') ? true : false;
                        }
                    }

                } else if (isset($integration['pivot']) && $integration['name'] == 'SoftPhone') {
                    $agent_alias = json_decode($integration['pivot']['configuration'], true)['EmployeeAlias'];
                    $workstream_data = WorkstreamData::where('agent_alias', '=', $agent_alias)
                        ->where('start_time', '>=', $day_time->toDateTimeString())
                        ->where('organisation_id', '=', Auth::user()->organisation_id)
                        ->orderBy('updated_at', 'asc')
                        ->get();
                    foreach ($workstream_data as $workstream) {
                        $workstream_id = "workstream-$workstream->workstream_id";

                        if (!isset($task_array[$workstream_id])) {
                            $task_array[$workstream_id]['total_time_spent'] = $workstream->handle_time;
                            $task_array[$workstream_id]['total_times_completed'] = 1;
                        } else {
                            $task_array[$workstream_id]['total_time_spent'] += $workstream->handle_time;
                            $task_array[$workstream_id]['total_times_completed']++;
                        }
                        $data = $workstream_data->last();
                        if (!isset($current_task) || $current_task['updated_at']->lt($data->updated_at)) {
                            $current_task['id'] = "workstream-$data->workstream_id";
                            $current_task['start_time'] = $data->start_time instanceOf DateTime ? $data->start_time->timezone(Helper::organisationTimezone())->toDateTimeString() : $data->start_time;
                            $current_task['end_time'] = $data->end_time instanceOf DateTime ? $data->end_time->timezone(Helper::organisationTimezone())->toDateTimeString() : $data->end_time;
                            $current_task['updated_at'] = $data->updated_at;
                            $current_task['completed'] = ($data->end_time != '0000-00-00 00:00:00') ? true : false;
                        }
                    }
                }
            }

            if ($current_task['updated_at'] instanceOf Carbon)
                $current_task['updated_at'] = $current_task['updated_at']->timezone(Helper::organisationTimezone())->toDateTimeString();

            $team['user'][$key]['current_task'] = $current_task;
            $team['user'][$key]['tasks'] = $task_array;
            $team['user'][$key]['adherence'] = $adherence_scores[$user['id']];
            if (isset($shift_data)) $team['user'][$key]['shift'] = $shift_data->toArray();
        }
        return Helper::jsonLoader(SUCCESS, array('team' => $team, 'team_stats' => $team_stats->toArray(), 'current_time' => $day_time->toDateTimeString()));
    }

    public function getUserUpdates()
    {
        $input = Input::all();
        $time = time();

        $workstream_data = [];
        $task_data = [];

        session_write_close();

        if (isset($input['team_id']) && isset($input['previous_time'])) {
            $previous_time = new Carbon($input['previous_time'], Helper::organisationTimezone());
            $previous_time = $previous_time->timezone(Config::get('app.timezone'))->toDateTimeString();

            $team_id = $input['team_id'];
        } else {
            return Helper::jsonLoader(INCORRECT_DATA);
        }
        $users = User::where('team_id', '=', $team_id)->where('active', '=', true)
            ->with(array('integration' => function ($query) {
                $query->whereIn('integration_id', array(2, 3));
            }))->get();

        $task_alias_array = [];
        $workstream_alias_array = [];
        foreach ($users as $user) {
            foreach ($user->integration as $integration) {
                if ($integration->name == 'CTI') {
                    $task_alias_array[] = json_decode($integration->pivot->configuration, true)['EmployeeAlias'];
                } else if ($integration->name == 'SoftPhone') {
                    $workstream_alias_array[] = json_decode($integration->pivot->configuration, true)['EmployeeAlias'];
                }
            }
        }

        $day_time = new Carbon(Helper::organisationTimezone());
        $day_time->startOfDay()->timezone(Config::get('app.timezone'));
        set_time_limit(60);
        while (time() - $time < 40) {
            $updated_workstream_aliases = WorkstreamData::distinct()->select(array('agent_alias'))->where('updated_at', '>=', $previous_time)->where('organisation_id', '=', Auth::user()->organisation_id)->groupBy('agent_alias')->orderBy('agent_alias')->get();
            $updated_task_aliases = TaskData::select(array('agent_alias'))->where('updated_at', '>=', $previous_time)->groupBy('agent_alias')->get();
            if (!$updated_workstream_aliases->isEmpty() || !$updated_task_aliases->isEmpty()) {
                if (!$updated_workstream_aliases->isEmpty()) {
                    $updated_workstream_array = [];
                    foreach ($updated_workstream_aliases as $alias) {
                        if ($alias->agent_alias != 0)
                            $updated_workstream_array[] = $alias->agent_alias;
                    }
                    if (count($updated_workstream_array) > 0) {
                        $workstream_data = WorkstreamData::select(DB::raw('workstream_id, agent_alias, sum(handle_time) as total_handle_time, count(handle_time) as number_events, max(updated_at) as last_updated'))
                            ->whereIn('agent_alias', $updated_workstream_array)
                            ->where('organisation_id', '=', Auth::user()->organisation_id)
                            ->where('start_time', '>', $day_time->toDateTimeString())
                            ->groupBy('agent_alias', 'workstream_id')
                            ->get();

                        $workstream_data = $workstream_data->toArray();

                        foreach ($workstream_data as $key => $value) {
                            $data = WorkstreamData::where('agent_alias', '=', $value['agent_alias'])
                                ->where('updated_at', '=', $value['last_updated'])
                                ->where('organisation_id', '=', Auth::user()->organisation_id)
                                ->first();

                            $workstream_data[$key]['latest_event'] = (isset($data)) ? $data->toArray() : [];
                        }
                    }
                }

                if (!$updated_task_aliases->isEmpty()) {
                    $updated_task_array = [];

                    foreach ($updated_task_aliases as $alias) {
                        if ($alias->agent_alias != 0)
                            $updated_task_array[] = $alias->agent_alias;
                    }
                    if (count($updated_task_array) > 0) {
                        $task_data = TaskData::select(DB::raw('task_id, agent_alias, sum(handle_time) as total_handle_time, count(handle_time) as number_events, max(updated_at) as last_updated'))
                            ->whereIn('agent_alias', $updated_task_array)
                            ->where('start_time', '>', $day_time->toDateTimeString())
                            ->where('organisation_id', '=', Auth::user()->organisation_id)
                            ->groupBy('agent_alias', 'task_id')
                            ->get();

                        $task_data = $task_data->toArray();

                        foreach ($task_data as $key => $value) {
                            $data = TaskData::where('agent_alias', '=', $value['agent_alias'])
                                ->where('organisation_id', '=', Auth::user()->organisation_id)
                                ->where('updated_at', '=', $value['last_updated'])
                                ->first();

                            $task_data[$key]['latest_event'] = $data->toArray();
                        }
                    }
                }
                break;
            }
            sleep(5);
        }
        return Helper::jsonLoader(SUCCESS, array('workstreams' => $workstream_data, 'tasks' => $task_data));
    }

    public function getTeamUpdates()
    {
        try {
            $team_id = Input::get('team_id');
        } catch (Exception $e) {
            return Helper::jsonLoader(INCORRECT_DATA);
        }
        $users = User::where('team_id', '=', $team_id)->where('active', '=', true)
            ->with(array('integration' => function ($query) {
                $query->whereIn('integration_id', array(2));
            }))->get();
        $agent_alias_array = [];

        foreach ($users as $user) {
            if (isset($user->integration[0]))
                $agent_alias_array[] = json_decode($user->integration[0]->pivot->configuration, true)['EmployeeAlias'];
        }

        $team_stats = WorkstreamData::select(DB::raw('avg(wait_time) as wait_time, avg(handle_time) as handle_time'))
            ->whereIn('agent_alias', $agent_alias_array)
            ->where('created_at', '>=', Carbon::now()->subHour()->toDateTimeString())
            ->where('wait_time', '<>', 0)
            ->get();
        $team_stats = $team_stats->toArray();
        foreach ($team_stats as $key => $data) {
            $team_stats[$key]['wait_time'] = round($team_stats[$key]['wait_time'], 1);
            $team_stats[$key]['handle_time'] = round($team_stats[$key]['handle_time'], 1);
        }
        return Helper::jsonLoader(SUCCESS, $team_stats);
    }

    public function getRecentTeamStats()
    {
        try {
            $team_id = Input::get('team_id');
        } catch (Exception $e) {
            return Helper::jsonLoader(INCORRECT_DATA);
        }
        $users = User::where('team_id', '=', $team_id)->where('active', '=', true)
            ->with(array('integration' => function ($query) {
                $query->whereIn('integration_id', array(2));
            }))->whereHas('integration', function ($query) {
                $query->whereIn('integration_id', array(2));
            })->get();

        if ($users->isEmpty()) {
            return Helper::jsonLoader(TEAM_NOT_FOUND);
        }
        $agent_alias_array = [];

        foreach ($users as $user) {
            if (isset($user->integration[0]))
                $agent_alias_array[] = json_decode($user->integration[0]->pivot->configuration, true)['EmployeeAlias'];
        }

        $start_time = Carbon::now()->subHour()->subMinutes(25);
        $end_time = Carbon::now();
        $team_stats = [];

        $workstream_data = WorkstreamData::whereIn('agent_alias', $agent_alias_array)
            ->where('created_at', '>=', $start_time->toDateTimeString())
            ->where('created_at', '<=', $end_time->toDateTimeString())
            ->where('wait_time', '<>', 0)
            ->orderBy('created_at', 'asc')
            ->get(array('wait_time', 'handle_time', 'created_at'));
        $end_time->subMinutes(25);
        for ($i = 0; $i < 50; $i++) {
            $temp_handle = 0;
            $temp_wait = 0;
            $temp_volume = 0;
            foreach ($workstream_data as $data_point) {
                $created_at = new Carbon($data_point->created_at);
                if ($created_at->gte($start_time) && $created_at->lt($end_time)) {
                    $temp_handle += $data_point->handle_time;
                    $temp_wait += $data_point->wait_time;
                    $temp_volume++;
                }
            }
            $team_stats[] = ($temp_volume > 0) ? array('handle_time' => round($temp_handle / $temp_volume, 1), 'wait_time' => round($temp_wait / $temp_volume, 1)) : array('handle_time' => 0, 'wait_time' => 0);
            $start_time->addSeconds(30);
            $end_time->addSeconds(30);
        }

        return Helper::jsonLoader(SUCCESS, $team_stats);
    }

    public function getWeeklyAdherence()
    {
        if (Input::has('user_id', 'date')) {
            $adherence = [];
            $date = Carbon::parse(Input::get('date'))->startOfWeek();
            $user_id = Input::get('user_id');

            for ($i = 0; $i < 7; $i++) {
                $tmp_date = $date->copy()->addDays($i)->toDateString();
                $adherence[$tmp_date] = $this->calcUserAdherence($user_id, $tmp_date, true);
            }

            return Helper::jsonLoader(SUCCESS, $adherence);
        } else {
            return Helper::jsonLoader(INCORRECT_DATA);
        }
    }

    public function getTeamAdherence()
    {
        if (Input::has('team_id', 'date')) {
            $lengths_only = Input::has('lengths_only') ? Input::get('lengths_only') === 'true' : false;
            return Helper::jsonLoader(SUCCESS, $this->calcTeamAdherence(Input::get('team_id'), Input::get('date'), $lengths_only));
        } else {
            return Helper::jsonLoader(INCORRECT_DATA);
        }
    }

    public function getUserStatistics()
    {
        $user_id = Input::has('user_id') ? Input::get('user_id') : Auth::user()->id;

        $date = Input::has('date') ? Input::get('date') : Carbon::now(Helper::organisationTimezone())->toDateString();

        $adherence = $this->calcUserAdherence($user_id, $date, true);

        if ($adherence['time_on_phone'] > 0 && $adherence['out_of_adherence'] !== null) {
            $adherence = 100 - $adherence['out_of_adherence']['total_time'] / $adherence['time_on_phone'] * 100;
        } else {
            $adherence = null;
        }

        $occupancy = $this->calcUserOccupancy($user_id, $date);

        return Helper::jsonLoader(SUCCESS, ['adherence' => $adherence, 'occupancy' => $occupancy]);

    }

    private function calcTeamAdherence($team_id, $date, $lengths_only = false)
    {

        $rostered_with_actual = User::where('team_id', '=', $team_id)
            ->where('active', '=', true)
            ->with(array('rosteredshift' => function ($query) use ($date) {
                $query->where('date', '=', $date)
                    ->with(
                        array(
                            'shiftdata',
                            'shifttask',
                            'shifttask.task',
                            'shifttask.taskdata',
                            'adherenceexception'
                        )
        );
        }))->get();

        $adherence_array = [];
        foreach ($rostered_with_actual as $user) {
            if (isset($user->rosteredshift[0])) {
                $user->rosteredshift[0]->rostered_start_time =
                    Carbon::parse($user->rosteredshift[0]->rostered_start_time, 'UTC')->tz(Helper::organisationTimezone());
                $user->rosteredshift[0]->rostered_end_time =
                    Carbon::parse($user->rosteredshift[0]->rostered_end_time, 'UTC')->tz(Helper::organisationTimezone());
            }

            $rostered_shift = isset($user->rosteredshift[0]) ? $user->rosteredshift[0] : null;
            $shift_data = isset($rostered_shift->shiftdata) ? $rostered_shift->shiftdata : null;
            if ($shift_data !== null) {
                if ($shift_data->last_ping != '0000-00-00 00:00:00' && Helper::timeDiffInSeconds($shift_data->last_ping, Carbon::now()->toDateTimeString()) > 600) {
                    $shift_data->end_time = $shift_data->last_ping;
                    $shift_data->save();
                }
                // This needs to be refactored as it's not a good practice to change the original value of
                // start_time and end_time. Other functions i.e. makeAdherenceArray() is dependent on original start
                // and end time.
                $user->rosteredshift[0]->shiftdata->start_time =
                    Carbon::parse($user->rosteredshift[0]->shiftdata->start_time, 'UTC')->tz(Helper::organisationTimezone());
                $user->rosteredshift[0]->shiftdata->end_time =
                    Carbon::parse($user->rosteredshift[0]->shiftdata->end_time, 'UTC')->tz(Helper::organisationTimezone());
            }

            $temp_array['time_on_phone'] = isset($rostered_shift) ?
                $this->timeOnPhone($rostered_shift, $shift_data) :
                0;

            $temp_array['out_of_adherence'] = isset($rostered_shift) ?
                $this->checkShiftAdherence($rostered_shift, $shift_data, $rostered_shift->shifttask, $lengths_only) :
                null;

            $temp_array['user'] = ($lengths_only) ?
                $user->id :
                $user;

            if (isset($temp_array['time_on_phone'], $temp_array['out_of_adherence']) && $temp_array['out_of_adherence']['total_time'] > $temp_array['time_on_phone'])
                $temp_array['out_of_adherence']['total_time'] = $temp_array['time_on_phone'];

            $adherence_array[$user->id] = $temp_array;
        }

        return $adherence_array;
    }

    private function calcUserAdherence($user_id, $date, $lengths_only = false)
    {
        $user = User::whereId($user_id)
            ->whereActive(true)
            ->with(array('rosteredshift' => function ($query) use ($date) {
                $query->where('date', '=', $date)
                    ->with(
                        array(
                            'shiftdata',
                            'shifttask',
                            'shifttask.task',
                            'shifttask.taskdata',
                            'adherenceexception'
                        )
                    );
            }))->first();

        $user->setTimezone(Helper::organisationTimezone());

        $rostered_shift = isset($user->rosteredshift[0]) ? $user->rosteredshift[0] : null;
        $shift_data = isset($rostered_shift->shiftdata) ? $rostered_shift->shiftdata : null;

        if ($shift_data !== null) {
            if ($shift_data->last_ping != '0000-00-00 00:00:00' && Helper::timeDiffInSeconds($shift_data->last_ping, Carbon::now()->toDateTimeString()) > 600) {
                $shift_data->end_time = $shift_data->last_ping;
                $shift_data->save();
            }
        }

        $temp_array['time_on_phone'] = isset($rostered_shift) ?
            $this->timeOnPhone($rostered_shift, $shift_data) :
            0;

        $temp_array['out_of_adherence'] = isset($rostered_shift) ?
            $this->checkShiftAdherence($rostered_shift, $shift_data, $rostered_shift->shifttask, $lengths_only) :
            null;

        $temp_array['user'] = ($lengths_only) ?
            $user->id :
            $user;

        if (isset($temp_array['time_on_phone'], $temp_array['out_of_adherence']) && $temp_array['out_of_adherence']['total_time'] > $temp_array['time_on_phone'])
            $temp_array['out_of_adherence']['total_time'] = $temp_array['time_on_phone'];

        return $temp_array;
    }

    private function calcUserOccupancy($user_id, $date)
    {
        $user = User::whereId($user_id)
            ->where('active', '=', true)
            ->with(
                array(
                    'rosteredshift' => function ($query) use ($date) {
                        $query->where('date', '=', $date)
                            ->with(
                                array(
                                    'shiftdata',
                                    'shifttask' => function ($query) {
                                        $query->with(
                                            array(
                                                'task',
                                                'taskdata'
                                            )
                                        );
                                    }
                                )
                            );
                    },
                    'integration' => function ($query) {
                        $query->whereIn('integrations.id', array(2, 3));
                    }
                )
            )
            ->first();

        if (!isset($user->rosteredshift[0], $user->rosteredshift[0]->shiftdata)) return null;

        $workstream_alias = null;
        $task_alias = null;
        $shift_data = $user->rosteredshift[0]->shiftdata;
        if ($shift_data->last_ping != '0000-00-00 00:00:00' && Helper::timeDiffInSeconds($shift_data->last_ping, Carbon::now()->toDateTimeString()) > 600) {
            $shift_data->end_time = $shift_data->last_ping;
            $shift_data->save();
        }

        $shift_start = $user->rosteredshift[0]->shiftdata->start_time;
        $shift_end = ($user->rosteredshift[0]->shiftdata->end_time !== '0000-00-00 00:00:00') ?
            $user->rosteredshift[0]->shiftdata->end_time :
            Carbon::now();
       
        foreach ($user->integration as $integration) {
            if ($integration->id == 2) $workstream_alias = json_decode($integration->pivot->configuration, true)['EmployeeAlias'];
            //if($integration->id == 3) $task_alias = json_decode($integration->pivot->configuration, true)['EmployeeAlias'];
        }

        if (isset($workstream_alias)) {
            $workstream_data = WorkstreamData::whereAgentAlias($workstream_alias)
                ->whereOrganisationId(Auth::user()->organisation_id)
                ->whereBetween('start_time', array($shift_start, $shift_end))
                ->get();

            $workstream_time = $this->timeInObject($workstream_data);
        }
        $scheduled_tasks = [];

        foreach ($user->rosteredshift[0]->shifttask as $task)
            if (isset($task->taskdata[0])) $scheduled_tasks[] = $task->taskdata[0];

        $time_on_tasks = $this->timeInObject($scheduled_tasks);
        $time_on_shift = $shift_start->diffInSeconds($shift_end) - $time_on_tasks;

        if (!isset($workstream_time) || $time_on_shift <= 0) {
            return 0;
        } else {
            return $workstream_time / $time_on_shift * 100;
        }
    }

    private function checkShiftAdherence($rostered_shift, $actual_shift, $tasks, $lengths_only = false)
    {
        $shift = [];
        if ($actual_shift !== null) {
            $shift_adherence_array = $this->checkAdherence(
                $rostered_shift->rostered_start_time,
                $rostered_shift->rostered_end_time,
                $actual_shift->start_time,
                $actual_shift->end_time
            );
        } else {
            $shift_adherence_array = $this->checkAdherence(
                $rostered_shift->rostered_start_time,
                $rostered_shift->rostered_end_time
            );
        }

        $shift['start_of_shift'] = $shift_adherence_array['start'];
        $shift['end_of_shift'] = $shift_adherence_array['end'];

        $shift = $this->checkShiftExceptions($rostered_shift->adherenceexception, $shift);

        $adherence_array = [
            'total_time' => 0,
        ];

        if (!$lengths_only) $adherence_array['shift'] = $shift;

        foreach ($shift as $period) {
            if (isset($period)) $adherence_array['total_time'] += $period['total_time'];
        }

        foreach ($tasks as $task) {
            if ($actual_shift !== null) {
                if (count($task->taskdata) === 0) $task->taskdata[] = null;

                $adherence = $this->checkTaskAdherence($actual_shift, $task, $task->taskdata[0]);

                $adherence = $this->checkTaskExceptions($rostered_shift->adherenceexception, $adherence);

                if (isset($adherence['start_of_task'])) $adherence_array['total_time'] += $adherence['start_of_task']['total_time'];
                if (isset($adherence['end_of_task'])) $adherence_array['total_time'] += $adherence['end_of_task']['total_time'];

                if (!$lengths_only) $adherence_array['tasks'][] = $adherence;
            }
        }

        return $adherence_array;
    }

    private function checkTaskAdherence($actual_shift, $rostered_task, $actual_task)
    {
        $task_array = [
            'shift_task_id' => $rostered_task->id,
            'task_id' => $rostered_task->task->id,
            'task_name' => $rostered_task->task->name,
            'start_of_task' => null,
            'end_of_task' => null
        ];

        if (isset($actual_task)) {
            $adherence_array = $this->checkAdherence($rostered_task->start_time, $rostered_task->end_time, $actual_task->start_time, $actual_task->end_time);
        } else {
            $shift_in_progress = $actual_shift->end_time === '0000-00-00 00:00:00';
            $r_start_time = $rostered_task->start_time;
            $r_end_time = $rostered_task->end_time;
            $shift_start_time = $actual_shift->start_time;
            $shift_end_time = $shift_in_progress ? Carbon::now() : $actual_shift->end_time;
            $rostered_task_starts_before_shift_starts = $r_start_time->lt($shift_start_time);
            $rostered_task_starts_before_shift_ends = $r_start_time->lt($shift_end_time);
            $rostered_task_ends_before_shift_starts = $r_end_time->lt($shift_start_time);
            $rostered_task_ends_before_shift_ends = $r_end_time->lt($shift_end_time);


            if (!$rostered_task_ends_before_shift_starts && $rostered_task_starts_before_shift_ends) {
                if ($rostered_task_starts_before_shift_starts) {
                    if ($rostered_task_ends_before_shift_ends || $shift_in_progress) {
                        $adherence_array = $this->checkAdherence($actual_shift->start_time, $r_end_time);
                    } else {
                        $adherence_array = $this->checkAdherence($actual_shift->start_time, $actual_shift->end_time);
                    }
                } else {
                    if ($rostered_task_ends_before_shift_ends || $shift_in_progress) {
                        $adherence_array = $this->checkAdherence($r_start_time, $r_end_time);
                    } else {
                        $adherence_array = $this->checkAdherence($r_start_time, $actual_shift->end_time);
                    }
                }
            }
        }
        if (isset($adherence_array)) {
            $task_array['start_of_task'] = $adherence_array['start'];
            $task_array['end_of_task'] = $adherence_array['end'];
        }
        return $task_array;
    }

    private function checkAdherence($r_start_time, $r_end_time, $a_start_time = null, $a_end_time = null)
    {
        $r_start_time = new Carbon($r_start_time);
        $r_end_time = new Carbon($r_end_time);
        $now = Carbon::now();

        $adherence_array = [
            'start' => null,
            'end' => null
        ];

        if ($a_start_time !== null && $a_end_time !== null) {
            $a_start_time = new Carbon($a_start_time);
            $a_end_time = $a_end_time === '0000-00-00 00:00:00' ? new Carbon : new Carbon($a_end_time);

            if ($a_start_time->lt($r_start_time)) {
                $adherence_array['start'] = $this->makeAdherenceArray($a_start_time, $r_start_time->lt($a_end_time) ? $r_start_time : $a_end_time);
            } else if ($a_start_time->lt($r_end_time)) {
                $adherence_array['start'] = $this->makeAdherenceArray($r_start_time, $a_start_time);
            } else {
                $adherence_array['start'] = $this->makeAdherenceArray($r_start_time, $r_end_time);
            }

            if ($a_end_time->gt($r_end_time)) {
                $adherence_array['end'] = $this->makeAdherenceArray($r_end_time->lt($a_start_time) ? $a_start_time : $r_end_time, $a_end_time);
            } else if ($a_end_time->gt($r_start_time)) {
                $adherence_array['end'] = $this->makeAdherenceArray($a_end_time, $r_end_time);
            } else {
                $adherence_array['end'] = $this->makeAdherenceArray($r_start_time, $r_end_time);
            }
        } else {
            if ($now->gt($r_end_time)) {
                $adherence_array['start'] = $this->makeAdherenceArray($r_start_time, $r_end_time);
            } else if ($now->gt($r_start_time)) {
                $adherence_array['start'] = $this->makeAdherenceArray($r_start_time, $now);
            }
        }

        return $adherence_array;
    }

    private function makeAdherenceArray(Carbon $start_time, Carbon $end_time)
    {
        if ($start_time->eq($end_time) || $start_time->gte(Carbon::now())) return null;
        // Removed the timezone converting for start and end time as they've been converted already in getTeamAdherence()
        // Need to refactor back cuz it's not good practice to change the original values of start_time and end_time
        return [
            'start' => $start_time->toDateTimeString(),
            'end' => $end_time->toDateTimeString(),
            'total_time' => abs($start_time->diffInSeconds($end_time))
        ];
    }

    private function timeOnPhone($rostered_shift, $actual_shift)
    {
        $rostered_length = new CarbonRange($rostered_shift['rostered_start_time'], $rostered_shift['rostered_end_time']);

        if ($actual_shift !== null) {
            $a_start = $actual_shift->start_time === '0000-00-00 00:00:00' ?
                Carbon::now() :
                $actual_shift->start_time;
            $a_end = $actual_shift->end_time === '0000-00-00 00:00:00' ?
                Carbon::now() :
                $actual_shift->end_time;

            if ($a_start->lt($rostered_length->start))
                $rostered_length->start = $a_start;
            if ($a_end->gt($rostered_length->end))
                $rostered_length->end = $a_end;
        }

        $on_phone_time = $rostered_length->diff('seconds');

        foreach ($rostered_shift['shifttask'] as $task) {
            if ($task['task']['planned'] == true && $task['task']['available'] == false)
                $on_phone_time -= Helper::timeDiffInSeconds($task['start_time'], $task['end_time']);
        }

        return $on_phone_time;
    }

    private function emptyShiftData($rostered_shift)
    {
        $shift_data = new ShiftData;

        $shift_data->start_time = '0000-00-00 00:00:00';
        $shift_data->end_time = '0000-00-00 00:00:00';
        $shift_data->shift_id = $rostered_shift->id;
        $shift_data->agent_alias = $rostered_shift->user_id;
        $shift_data->organisation_id = Auth::user()->organisation_id;
        $shift_data->save();

        return $shift_data;
    }

    private function checkShiftExceptions($exceptions, $adherence)
    {
        if (count($exceptions) === 0) return $adherence;

        if ($adherence['start_of_shift'] !== null)
            $start_of_shift = new CarbonRange($adherence['start_of_shift']['start'], $adherence['start_of_shift']['end'], Helper::organisationTimezone());
        if ($adherence['end_of_shift'] !== null)
            $end_of_shift = new CarbonRange($adherence['end_of_shift']['start'], $adherence['end_of_shift']['end'], Helper::organisationTimezone());

        foreach ($exceptions as $exception) {
            if (isset($start_of_shift)) {
                $temp = $start_of_shift->intersect(new CarbonRange($exception->start_time, $exception->end_time));
                if ($temp !== null) $adherence['start_of_shift']['total_time'] -= $temp->diff('seconds');
            }

            if (isset($end_of_shift)) {
                $temp = $end_of_shift->intersect(new CarbonRange($exception->start_time, $exception->end_time));
                if ($temp !== null) $adherence['end_of_shift']['total_time'] -= $temp->diff('seconds');
            }
        }
        return $adherence;
    }

    private function checkTaskExceptions($exceptions, $adherence)
    {
        if (count($exceptions) === 0) return $adherence;

        if ($adherence['start_of_task'] !== null)
            $start_of_task = new CarbonRange($adherence['start_of_task']['start'], $adherence['start_of_task']['end'], Helper::organisationTimezone());
        if ($adherence['end_of_task'] !== null)
            $end_of_task = new CarbonRange($adherence['end_of_task']['start'], $adherence['end_of_task']['end'], Helper::organisationTimezone());

        foreach ($exceptions as $exception) {
            if (isset($start_of_task)) {
                $temp = $start_of_task->intersect(new CarbonRange($exception->start_time, $exception->end_time));
                if ($temp !== null) $adherence['start_of_task']['total_time'] -= $temp->diff('seconds');
            }

            if (isset($end_of_task)) {
                $temp = $end_of_task->intersect(new CarbonRange($exception->start_time, $exception->end_time));
                if ($temp !== null) $adherence['end_of_task']['total_time'] -= $temp->diff('seconds');
            }
        }

        return $adherence;
    }

    private function timeInObject($objs)
    {
        if (count($objs) === 0) return 0;
        $ranges = $this->toCarbonRange($objs);
        $intersects = $this->intersects($ranges);
        $total = 0;

        foreach ($ranges as $range) $total += $range->diff('seconds');
        foreach ($intersects as $int) $total -= $int->diff('seconds');

        return $total;
    }

    private function toCarbonRange($objs)
    {
        $temp_array = [];
        foreach ($objs as $obj) {
            $temp = new CarbonRange($obj->start_time, $this->timeOrNow($obj->end_time));
            if (!($temp->diff('hours') < 1 && $obj->end_time === '0000-00-00 00:00:00')) $temp_array[] = $temp;
        }
        return $temp_array;
    }

    private function intersects($ranges)
    {
        $temp_array = $ranges;
        $array = [];

        foreach ($ranges as $range_key => $range) {
            foreach ($temp_array as $key => $val) {
                if ($range !== $val && ($intersect = $range->intersect($val)) !== null) {
                    $array[] = $intersect;
                }
            }
            unset($temp_array[$range_key]);
        }

        return $array;
    }

    private function timeOrNow($date)
    {
        return $date === '0000-00-00 00:00:00' ? Carbon::now()->toDateTimeString() : $date;
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
                             ng-style="(row.order % 3 == 2 && {\'border-bottom\': \'1px lightgrey solid\'} || {})"
                             ng-click="raiseDOMRowClickedEvent($event, row)"
                             ng-repeat="row in gantt.rows track by row.id"
                             ng-class="{\'add-bottom-margin\': $last }">

                            <!--a task will override the row event -->
                            <div ng-class="(task.isMilestone === true && \'gantt-task-milestone\' || \'gantt-task\')"
                                 ng-style="{\'left\': task.left +\'em\', \'width\': task.width +\'em\', \'z-index\': task.data.zIndex, \'background-color\': task.color}"
                                 ng-click="raiseDOMTaskClickedEvent($event, task)"
                                 ng-repeat="task in row.tasks | ganttTaskLimit:scroll_start:scroll_width track by task.id"
                                 gantt-task-moveable
                                 ng-context-menu="menuOptions"
                                 >
                                <gantt-tooltip ng-model="task" style="margin-top:-5px; height:100%;">
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