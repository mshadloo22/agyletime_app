<?php
use \App\Models\Roster\User;
use \App\Helper\Helper;
use \App\Helper\Revision;
use Carbon\Carbon;
use \App\Events\PublishedScheduleHasBeenUpdated;


class ScheduleController extends BaseController
{
    public function __construct()
    {
        $this->beforeFilter('api_auth');
    }

    public function scheduling()
    {
        echo 'hiiiii';
        return \View::make('scheduling')
            ->with('opening_hours', Helper::openingHoursArray());
    }

    public function schedule_role()
    {
        return \View::make('schedule_role')
            ->with('opening_hours', Helper::openingHoursArray());
    }

    public function getSchedule()
    {

        if(\Auth::check() && \Auth::user()->primary_contact){
            \Auth::loginUsingId(\Input::get('user_id', \Auth::id()));
        }

        $input = \Input::all();
        if (isset($input['team_id'], $input['date'])) {
            try {
                $team_id = $input['team_id'];
                $start_date = Carbon::parse($input['date'], Helper::organisationTimezone())->startOfWeek();
                $end_date = Carbon::parse($input['date'], Helper::organisationTimezone())->endOfWeek();

                $schedule = Roster::where('date_start', '=', $start_date->toDateString())->where('team_id', '=', $team_id)->first();

                if (!isset($schedule)) {
                    $schedule = new Roster;
                    $schedule->team_id = $team_id;
                    $schedule->date_start = $start_date->toDateString();
                    $schedule->date_ending = $end_date->toDateString();
                    $schedule->roster_stage = 'pending';
                    $schedule->save();
                }

                $schedule = Roster::where('date_start', '=', $start_date->toDateString())->where('team_id', '=', $team_id)
                    ->with('rosteredshift.task')->with(array('team.user' => function ($query) use ($start_date, $end_date) {
                        $query->where('user.active', '=', true)
                            ->with(array('availspecific' => function ($query) use ($start_date, $end_date) {
                                $query->where(function ($query) use ($start_date, $end_date) {
                                    $query->orWhere(function ($query) use ($start_date, $end_date) {
                                        $query->where('start_date', '<=', $start_date->toDateString())
                                            ->where('end_date', '>=', $start_date->toDateString());
                                    })->orWhere(function ($query) use ($start_date, $end_date) {
                                        $query->where('start_date', '>=', $start_date->toDateString())
                                            ->where('start_date', '<=', $end_date->toDateString());
                                    })->orWhere(function ($query) use ($start_date, $end_date) {
                                        $query->where('start_date', '<=', $start_date->toDateString())
                                            ->where('end_date', '>=', $end_date->toDateString());
                                    })->orWhere(function ($query) use ($start_date, $end_date) {
                                        $query->where('start_date', '>=', $start_date->toDateString())
                                            ->where('end_date', '<=', $end_date->toDateString());
                                    });
                                })
                                    ->where('user_avail_spec.authorized', '=', 'approved');
                            }))
                            ->with('availgeneral');
                    }))->first();
            } catch (Exception $e) {
                return Helper::jsonLoader(EXCEPTION, array("message" => $e->getMessage(), "line" => $e->getLine(), "file" => $e->getFile()));
            }
            $user_id_list = [];
            foreach ($schedule->rosteredshift as $key => $shift) {
                $temp_user_id = $schedule->rosteredshift[$key]->user_id;
                if ($shift->rostered_start_time !== '0000-00-00 00:00:00') {
                    $temp = Carbon::parse($shift->rostered_start_time)->timezone(Helper::organisationTimezone())->toDateTimeString();
                    $schedule->rosteredshift[$key]->rostered_start_time = $temp;
                    array_push($user_id_list, $temp_user_id);
                }
                if ($shift->rostered_end_time !== '0000-00-00 00:00:00') {
                    $temp = Carbon::parse($shift->rostered_end_time)->timezone(Helper::organisationTimezone())->toDateTimeString();
                    $schedule->rosteredshift[$key]->rostered_end_time = $temp;
                    array_push($user_id_list, $temp_user_id);
                }
            }

            // Adding all missing users(deactivated or removed from the current team)
            // in order not to break the schedule view
            foreach ($schedule->team->user as $key => $user) {
                $temp_user_id = $schedule->team->user[$key]->id;
                array_push($user_id_list, $temp_user_id);
            }
            $user_id_list = array_unique($user_id_list);
            sort($user_id_list);
            $all_related_users = User::find($user_id_list);
            $all_related_users = $all_related_users->toArray();
            $schedule = $schedule->toArray();
            $schedule['team']['user'] = $all_related_users;

            $schedule['timezone'] = Carbon::now(Helper::organisationTimezone())->offset / 60;
            return Helper::jsonLoader(SUCCESS, $schedule);
        } else {
            return Helper::jsonLoader(INCORRECT_DATA);
        }
    }


    public function getNewSchedule()
    {
        $input = \Input::all();
        if (isset($input['role_id'], $input['date'])) {
            try {
                $role_id = $input['role_id'];
                $start_date = new Carbon($input['date'], Helper::organisationTimezone());
                $start_date->startOfWeek();
                $end_date = $start_date->copy()->endOfWeek();
                $schedule = Schedule::firstOrCreate(array('start_date' => $start_date->toDateString(), 'end_date' => $end_date->toDateString(), 'role_id' => $role_id));
                $schedule = Schedule::with(array('scheduledshift' => function ($query) use ($input) {
                    $query->where('date', '=', $input['date'])
                        ->with('task');
                }))->find($schedule->id);

            } catch (Exception $e) {
                return Helper::jsonLoader(EXCEPTION, array("message" => $e->getMessage(), "line" => $e->getLine(), "file" => $e->getFile()));
            }

            $schedule = $schedule->toArray();
            $schedule['timezone'] = Carbon::now(Helper::organisationTimezone())->offset / 60;
            return Helper::jsonLoader(SUCCESS, $schedule);
        } else {
            return Helper::jsonLoader(INCORRECT_DATA);
        }
    }

    public function postNewSchedule()
    {
        $input = \Input::all();

        if (isset($input['schedule'], $input['shifts'])) {
            $schedule = $input['schedule'];
            $rows = $input['shifts']['rows'];

            try {
                $schedule = Schedule::findOrFail($schedule['id']);

                if (isset($input['deleted_objects'])) {
                    $deleted_objects = $input['deleted_objects'];

                    if (isset($deleted_objects['tasks']))
                        ShiftTask::destroy($deleted_objects['tasks']);

                    if (isset($deleted_objects['shifts']))
                        ScheduledShift::destroy($deleted_objects['shifts']);
                }

                foreach ($rows as $row) {
                    if (isset($row['tasks'])) {
                        foreach ($row['tasks'] as $shift) {
                            if ($shift['subject'] === 'Shift') {
                                if (isset($shift['data']['db_id'])) {
                                    $shift_model = ScheduledShift::findOrFail($shift['data']['db_id']);
                                } else {
                                    $shift_model = new ScheduledShift;
                                    $shift_model->schedule_id = $schedule->id;
                                }
                                $shift_model->date = $this->convertEpoch($shift['from'])->toDateString();
                                $shift_model->start_time = $this->ConvertEpoch($shift['from']);
                                $shift_model->end_time = $this->ConvertEpoch($shift['to']);

                                $shift_model->save();

                                if (isset($shift['child'])) {
                                    foreach ($shift['child'] as $shift_task) {
                                        if (isset($shift_task['data']['db_id'])) {
                                            $shift_task_model = ShiftTask::findOrFail($shift_task['data']['db_id']);
                                        } else {
                                            $shift_task_model = new ShiftTask;
                                            $shift_task_model->task_id = Task::where('organisation_id', '=', \Auth::user()->organisation_id)
                                                ->where('identifier', '=', $shift_task['data']['identifier'])
                                                ->first()->id;
                                            $shift_task_model->scheduled_shift_id = $shift_model->id;
                                        }
                                        $shift_task_model->start_time = $this->ConvertEpoch($shift_task['from']);
                                        $shift_task_model->end_time = $this->ConvertEpoch($shift_task['to']);
                                        $shift_task_model->added_by = Auth::user()->id;
                                        $shift_task_model->save();
                                    }
                                }
                            }
                        }
                    }
                }
            } catch (Exception $e) {
                return Helper::jsonLoader(EXCEPTION, array("message" => $e->getMessage(), "line" => $e->getLine(), "file" => $e->getFile()));
            }


            return Helper::jsonLoader(SUCCESS);

        } else {
            return Helper::jsonLoader(INCORRECT_DATA);
        }
    }

    /**
     * Verification for checking whether this roster has shifts or tasks overlap each other
     * @param $employees
     * @return bool
     */
    private function verifyShiftOverlap($employees)
    {
        $is_overlap = false;
        //@Todo: any chance to break in loop?
        foreach ($employees as $employee) {
            if (isset($employee['tasks'])) {
                foreach ($employee['tasks'] as $cur_task) {
                    $cur_start_time = $this->ConvertEpoch($cur_task['from']);
                    $cur_end_time = $this->ConvertEpoch($cur_task['to']);
                    foreach ($employee['tasks'] as $task) {
                        if ($cur_task['id'] != $task['id']) {
                            $start_time = $this->ConvertEpoch($task['from']);
                            $end_time = $this->ConvertEpoch($task['to']);
                            if ($cur_start_time->lte($start_time)) {
                                if ($cur_end_time->gt($start_time)) {
                                    $is_overlap = true;
                                }
                            } else {
                                if ($cur_start_time->lt($end_time)) {
                                    $is_overlap = true;
                                }
                            }
                        }
                    }
                    if (isset($cur_task['child'])) {
                        foreach ($cur_task['child'] as $cur_subtask) {
                            $cur_sub_start_time = $this->ConvertEpoch($cur_subtask['from']);
                            $cur_sub_end_time = $this->ConvertEpoch($cur_subtask['to']);
                            foreach ($cur_task['child'] as $subtask) {
                                if ($cur_subtask['id'] != $subtask['id']) {
                                    $sub_start_time = $this->ConvertEpoch($subtask['from']);
                                    $sub_end_time = $this->ConvertEpoch($subtask['to']);
                                    if ($cur_sub_start_time->lte($sub_start_time)) {
                                        if ($cur_sub_end_time->gt($sub_start_time)) {
                                            $is_overlap = true;
                                        }
                                    } else {
                                        if ($cur_sub_start_time->lt($sub_end_time)) {
                                            $is_overlap = true;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        if ($is_overlap) {
            return true;
        } else {
            return false;
        }

    }

    public function postSchedule()
    {
        $input = \Input::all();
        $date_list = [];

        if (isset($input['roster'], $input['employees'])) {
            $roster = $input['roster'];
            $input_for_revision = Revision::retrieveSchedule($roster['team_id'], $roster['date_start'], $roster['date_ending']);
            $employees = $input['employees']['rows'];

            if (!$this->verifyShiftOverlap($employees)) {

                try {
                    $roster = Roster::findOrFail($roster['id']);
                    if (isset($input['deleted_objects'])) {
                        $deleted_objects = $input['deleted_objects'];
                        if (isset($deleted_objects['tasks'])) {
                            $id_list = $deleted_objects['tasks'];
                            $input_for_revision['deleted_objects']['tasks'] = ShiftTask::find($id_list)->toArray();
                            ShiftTask::destroy($id_list);
                        }
                        if (isset($deleted_objects['shifts'])) {
                            $id_list = $deleted_objects['shifts'];
                            $input_for_revision['deleted_objects']['shifts'] = RosteredShift::find($id_list)->toArray();
                            foreach ($input_for_revision['deleted_objects']['shifts'] as $shift) {
                                array_push($date_list, new Carbon($shift['date']));
                            }
                            RosteredShift::destroy($id_list);
                        }
                    }

                    foreach ($employees as $employee) {
                        $user_model = User::findOrFail($employee['id']);
                        if (isset($employee['tasks'])) {
                            foreach ($employee['tasks'] as $shift) {
                                if ($shift['subject'] == 'Shift') {
                                    if (isset($shift['data']['db_id'])) {
                                        $shift_model = RosteredShift::findOrFail($shift['data']['db_id']);
                                    } else {
                                        $shift_model = new RosteredShift;
                                        $shift_model->roster_id = $roster->id;
                                    }
                                    $hasShiftUpdated = $this->hasShiftUpdated($shift, $shift_model, $user_model);
                                    $shift_model->date = $this->ConvertEpoch($shift['from'])->toDateString();
                                    $temp_start = $this->ConvertEpoch($shift['from'])->timezone('UTC');
                                    $temp_end = $this->ConvertEpoch($shift['to'])->timezone('UTC');
                                    $shift_model->rostered_start_time = $temp_start;
                                    $shift_model->rostered_end_time = $temp_end;
                                    $shift_model->user_id = $user_model->id;
                                    $shift_model->save();
                                    if ($hasShiftUpdated == true) {
                                        array_push($date_list, $this->ConvertEpoch($shift['from']), $this->ConvertEpoch($shift['to']));
                                    }
                                    if (isset($shift['child'])) {
                                        foreach ($shift['child'] as $shift_task) {
                                            if (isset($shift_task['data']['db_id'])) {
                                                $shift_task_model = ShiftTask::findOrFail($shift_task['data']['db_id']);
                                            } else {
                                                $shift_task_model = new ShiftTask;
                                                $shift_task_model->task_id = Task::where('organisation_id', '=', \Auth::user()->organisation_id)
                                                    ->where('identifier', '=', $shift_task['data']['identifier'])
                                                    ->first()->id;
                                                $shift_task_model->rostered_shift_id = $shift_model->id;
                                            }
                                            $hasShiftTaskUpdated = $this->hasShiftTaskUpdated($shift, $shift_model, $shift_task, $shift_task_model, $user_model);
                                            $shift_task_model->start_time = $this->ConvertEpoch($shift_task['from']);
                                            $shift_task_model->end_time = $this->ConvertEpoch($shift_task['to']);
                                            $shift_task_model->added_by = Auth::user()->id;
                                            $shift_task_model->save();
                                            if ($hasShiftTaskUpdated == true) {
                                                array_push($date_list, $this->ConvertEpoch($shift['from']), $this->ConvertEpoch($shift['to']));
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                } catch (Exception $e) {
                    return Helper::jsonLoader(EXCEPTION, array("message" => $e->getMessage(), "line" => $e->getLine(), "file" => $e->getFile()));
                }

                usort($date_list, array('ScheduleController', 'cmpDate'));
                $date_start = $date_list[0]->toDateString();
                $date_end = $date_list[count($date_list) - 1]->toDateString();
                \Event::fire(new PublishedScheduleHasBeenUpdated($input_for_revision, $date_start, $date_end));

                return Helper::jsonLoader(SUCCESS);

            } else {
                return Helper::jsonLoader(INCORRECT_DATA); //Shifts or tasks overlap each other
            }

        } else {
            return Helper::jsonLoader(INCORRECT_DATA);
        }
    }

    //Check whether this shift is updated
    private function hasShiftUpdated($shift, $shift_model, $user_model)
    {
        $result = false;
        $temp_start = $this->ConvertEpoch($shift['from'])->timezone('UTC');
        $temp_end = $this->ConvertEpoch($shift['to'])->timezone('UTC');
        if (isset($shift_model->date)) {
            if ($shift_model->date->toDateString() != $this->ConvertEpoch($shift['from'])->toDateString() ||
                $shift_model->rostered_start_time->ne($temp_start) ||
                $shift_model->rostered_end_time->ne($temp_end) ||
                $shift_model->user_id != $user_model->id
            ) {
                $result = true;
            }
        } else { //new shift has been created
            $result = true;
        }
        return $result;
    }

    //Check whether this task is updated
    private function hasShiftTaskUpdated($shift, $shift_model, $shift_task, $shift_task_model, $user_model)
    {
        $result = false;
        $temp_start = $this->ConvertEpoch($shift_task['from'])->timezone('UTC');
        $temp_end = $this->ConvertEpoch($shift_task['to'])->timezone('UTC');
        if (isset($shift_model->date, $shift_task_model->start_time, $shift_task_model->end_time)) {
            if ($shift_model->date->toDateString() != $this->ConvertEpoch($shift['from'])->toDateString() ||
                $shift_task_model->start_time->ne($temp_start) ||
                $shift_task_model->end_time->ne($temp_end) ||
                $shift_model->user_id != $user_model->id
            ) {
                $result = true;
            }
        } else { //new shift has been created
            $result = true;
        }
        return $result;
    }

    private static function cmpDate(Carbon $a, Carbon $b)
    {
        if ($a->eq($b)) {
            return 0;
        }
        return ($a->lt($b)) ? -1 : 1;
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
                                 ng-style="{\'margin-top\': ((gantt.getActiveHeadersCount()-1)*2)+\'em\'}">
                                <span>Description</span>
                            </div>
                        </div>
                        <div class="gantt-labels-body"
                             ng-style="(maxHeight > 0 && {\'max-height\': maxHeight+\'px\'} || {})"
                             ng-show="gantt.columns.length > 0">
                            <div gantt-vertical-scroll-receiver
                                 ng-style="{\'position\': \'relative\'}">
                                <div class="gantt-labels-row gantt-row-height"
                                     ng-class-odd="\'gantt-background-row\'"
                                     ng-class-even="\'gantt-background-row-alt\'"
                                     ng-repeat="row in gantt.rows">
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
                                    {{ viewScale === \'hour\' && (c.date | date:\'dd EEEE\') || (c.date | date:\'dd\') }}
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
                            <div class="gantt-body-background">
                                <div class="gantt-row-height"
                                     ng-class-odd="\'gantt-background-row\'"
                                     ng-class-even="\'gantt-background-row-alt\'"
                                     ng-repeat="row in gantt.rows"

                                     >
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

                                    <!--a task will override the row event -->
                                    <div class="gantt-task"
                                         ng-class="(task.isMilestone === true && \'gantt-task-milestone\' || \'gantt-task\')"
                                         ng-style="{\'left\': ((task.isMilestone === true || task.width === 0) && (task.left-0.3) || task.left)+\'em\', \'width\': task.width +\'em\', \'z-index\': task.data.zIndex, \'background-color\': task.color}"
                                         ng-click="raiseDOMTaskClickedEvent($event, task)"
                                         ng-repeat="task in row.tasks | ganttTaskLimit:scroll_start:scroll_width track by task.id"
                                         gantt-task-moveable>
                                        <gantt-tooltip ng-model="task">
                                            <div class="gantt-task-content"><span>{{ (task.isMilestone === true && \'&nbsp;\' || task.subject) }}</span></div>
                                        </gantt-tooltip>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>';
    }

    public function select_gantt_template()
    {
        return '<div class="gantt">
                    <div class="gantt-labels"
                         ng-style="(labelsWidth > 0 && {\'width\': labelsWidth+\'px\'} || {})"
                         gantt-label-resizable="labelsWidth" resize-min="50">
                        <div class="gantt-labels-head"
                             ng-show="gantt.columns.length > 0">
                            <div class="gantt-labels-head-row"
                                 ng-style="{\'margin-top\': ((gantt.getActiveHeadersCount()-1)*2)+\'em\'}">
                                <span>Description</span>
                            </div>
                        </div>
                        <div class="gantt-labels-body"
                             ng-style="(maxHeight > 0 && {\'max-height\': maxHeight+\'px\'} || {})"
                             ng-show="gantt.columns.length > 0">
                            <div gantt-vertical-scroll-receiver
                                 ng-style="{\'position\': \'relative\'}">
                                <div class="gantt-labels-row gantt-row-height"
                                     ng-class-odd="\'gantt-background-row\'"
                                     ng-class-even="\'gantt-background-row-alt\'"
                                     ng-repeat="row in gantt.rows">
                                    <gantt-sortable swap="swapRows(a,b)" active="allowRowSorting" ng-model="row">
                                        <select class="desc-select"
                                                ng-model="row.tasks[0].data.selected_user"
                                                ng-options="user.name group by user.team for user in gantt.users(row)">
                                            <option value="">-- Employee --</option>
                                        </select>
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
                                    {{ viewScale === \'hour\' && (c.date | date:\'dd EEEE\') || (c.date | date:\'dd\') }}
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
                            <div class="gantt-body-background">
                                <div class="gantt-row-height"
                                     ng-class-odd="\'gantt-background-row\'"
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

                                    <!--a task will override the row event -->
                                    <div ng-class="(task.isMilestone === true && \'gantt-task-milestone\' || \'gantt-task\')"
                                         ng-style="{\'left\': ((task.isMilestone === true || task.width === 0) && (task.left-0.3) || task.left)+\'em\', \'width\': task.width +\'em\', \'z-index\': task.data.zIndex, \'background-color\': task.color}"
                                         ng-click="raiseDOMTaskClickedEvent($event, task)"
                                         ng-repeat="task in row.tasks | ganttTaskLimit:scroll_start:scroll_width track by task.id"
                                         gantt-task-moveable>
                                        <gantt-tooltip ng-model="task">
                                            <div class="gantt-task-content"><span>{{ (task.isMilestone === true && \'&nbsp;\' || task.subject) }}</span></div>
                                        </gantt-tooltip>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>';
    }

    private function ConvertEpoch($epoch)
    {
        $time = new Carbon;
        $time->timezone(Helper::organisationTimezone());
        return $time->timestamp($epoch / 1000);
    }
}

