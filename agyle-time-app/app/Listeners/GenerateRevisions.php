<?php

namespace App\Listeners;

use App\Events\PublishedScheduleHasBeenUpdated;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use \App\Models\Roster\User;
use \App\Helper\Helper;
use \Carbon\Carbon;
use \App\Models\Roster\Revision;
use \App\Models\Roster\RevisionShift;

class GenerateRevisions
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {

    }

    /**
     * Handle the event.
     *
     * @param  PublishedScheduleHasBeenUpdated $event
     * @return void
     */
    public function handle(PublishedScheduleHasBeenUpdated $event)
    {
        $old_schedule = $event->schedule;
        $date_start = $event->date_start;
        $date_end = $event->date_end;
        if ($old_schedule['roster_stage'] == 'released') {
            try {
                $team_id = $old_schedule['team_id'];
                $new_schedule = $this->retrieveSchedule($team_id, $old_schedule['date_start'], $old_schedule['date_ending']);
                $old_shifts = $old_schedule['rosteredshift'];
                $new_shifts = $new_schedule['rosteredshift'];
                $revision = new Revision;
                $revision->modified_by = \Auth::user()->id;
                $revision->date_start = $date_start;
                $revision->date_end = $date_end;
                $revision->organisation_id = \Auth::user()->organisation->id;
                $revision->team_id = $team_id;
                $revision->save();
                //Check for DELETE_SHIFT
                foreach ($old_shifts as $old_shift) {
                    $shift_existed = false;
                    foreach ($new_shifts as $new_shift) {
                        if ($old_shift['id'] == $new_shift['id']) {
                            $shift_existed = true;
                            $this->revisionOnUpdateShift($old_shift, $new_shift, $revision);
                        }
                    }
                    if ($shift_existed == false) {
                        $this->revisionOnDeleteShift($old_shift, $revision);
                    }
                }
                //Check for checking CREATE_SHIFT
                foreach ($new_shifts as $new_shift) {
                    $shift_existed = false;
                    foreach ($old_shifts as $old_shift) {
                        if ($old_shift['id'] == $new_shift['id']) {
                            $shift_existed = true;
                        }
                    }
                    if ($shift_existed == false) {
                        //CREATE_SHIFT
                        $this->revisionOnCreateShift($new_shift, $revision);
                    }
                }

                $count = RevisionShift::where('revision_id', $revision->id)->count();
                if($count == 0) {
                    $revision->delete();
                }

            } catch (\Exception $e) {
                dump($e->getMessage());
            }
        }
    }

    /**
     * Check if this shift has been updated/deleted, also check related tasks' update/deletion/creation
     * @param $old_shift
     * @param $new_shift
     * @param $revision
     */
    private function revisionOnUpdateShift($old_shift, $new_shift, $revision)
    {
        //Check if this shift is updated
        $revision_shift = new RevisionShift;
        $revision_shift->revision_id = $revision->id;
        $revision_shift->status = UPDATE_SHIFT;

        $old_date = new Carbon($old_shift['date']);
        $old_date = $old_date->toDateString();
        $new_date = new Carbon($new_shift['date']);
        $new_date = $new_date->toDateString();
        $revision_shift->old_date = $old_date;
        if ($old_date != $new_date) {
            $revision_shift->new_date = $new_date;
        }

        $revision_shift->old_user_id = $old_shift['user_id'];
        if ($old_shift['user_id'] != $new_shift['user_id']) {
            $revision_shift->new_user_id = $new_shift['user_id'];
        }

        $old_start_time = new Carbon($old_shift['rostered_start_time'], Helper::organisationTimezone());
        $new_start_time = new Carbon($new_shift['rostered_start_time'], Helper::organisationTimezone());
        $revision_shift->old_start_time = $old_start_time->timezone('UTC');
        if ($old_start_time->ne($new_start_time)) {
            $revision_shift->new_start_time = $new_start_time->timezone('UTC');
        }

        $old_end_time = new Carbon($old_shift['rostered_end_time'], Helper::organisationTimezone());
        $new_end_time = new Carbon($new_shift['rostered_end_time'], Helper::organisationTimezone());
        $revision_shift->old_end_time = $old_end_time->timezone('UTC');
        if ($old_end_time->ne($new_end_time)) {
            $revision_shift->new_end_time = $new_end_time->timezone('UTC');
        }
        $revision_shift->shift_id = $old_shift['id'];
        $revision_shift->roster_id = $old_shift['roster_id'];
        if (isset($revision_shift->new_user_id) || isset($revision_shift->new_date) || isset($revision_shift->new_start_time)
            || isset($revision_shift->new_end_time)) {
            $revision_shift->save();
        }
        //Check Shift_tasks
        if (!empty($old_shift['task']) || !empty($new_shift['task'])) {
            //Nested loop for checking DELETE_TASK

            foreach ($old_shift['task'] as $old_task) {
                $task_existed = false;
                foreach ($new_shift['task'] as $new_task) {
                    if ($old_task['pivot']['id'] == $new_task['pivot']['id']) {
                        //Update Task
                        $task_existed = true;
                        $this->revisionOnUpdateTask($old_task, $old_shift, $new_task, $new_shift, $revision);
                    }
                }
                if ($task_existed == false) {
                    //Task has been deleted
                    $this->revisionOnDeleteTask($old_task, $old_shift, $revision);
                }
            }
            //Nested loop for checking CREATE_TASK
            foreach ($new_shift['task'] as $new_task) {
                $task_existed = false;
                foreach ($old_shift['task'] as $old_task) {
                    if ($old_task['id'] == $new_task['id']) {
                        $task_existed = true;
                    }
                }
                if ($task_existed == false) {
                    //CREATE_TASK
                    $this->revisionOnCreateTask($new_task, $new_shift, $revision);
                }
            }
        }
    }

    /**
     * @param $new_shift
     * @param $revision
     */
    private function revisionOnCreateShift($new_shift, $revision)
    {
        $revision_shift = new RevisionShift;
        $revision_shift->revision_id = $revision->id;
        $revision_shift->status = CREATE_SHIFT;
        $revision_shift->shift_id = $new_shift['id'];
        $revision_shift->roster_id = $new_shift['roster_id'];
        $revision_shift->new_user_id = $new_shift['user_id'];
        $revision_shift->new_date = $new_shift['date'];
        $start_time = new Carbon($new_shift['rostered_start_time'], Helper::organisationTimezone());
        $revision_shift->new_start_time = $start_time->timezone('UTC');
        $end_time = new Carbon($new_shift['rostered_end_time'], Helper::organisationTimezone());
        $revision_shift->new_end_time = $end_time->timezone('UTC');
        $revision_shift->save();

        if (isset($new_shift['task'])) {
            //CREATE TASK
            foreach ($new_shift['task'] as $new_task) {
                $this->revisionOnCreateTask($new_task, $new_shift, $revision);
            }
        }
    }

    /**
     * Record a revision on this shift and corresponding tasks
     * @param $old_shift
     * @param $revision
     */
    private function revisionOnDeleteShift($old_shift, $revision)
    {
        $revision_shift = new RevisionShift;
        $revision_shift->revision_id = $revision->id;
        $revision_shift->status = DELETE_SHIFT;
        $revision_shift->shift_id = $old_shift['id'];
        $revision_shift->roster_id = $old_shift['roster_id'];
        $revision_shift->old_user_id = $old_shift['user_id'];
        $revision_shift->old_date = $old_shift['date'];
        $start_time = new Carbon($old_shift['rostered_start_time'], Helper::organisationTimezone());
        $revision_shift->old_start_time = $start_time->timezone('UTC');
        $end_time = new Carbon($old_shift['rostered_end_time'], Helper::organisationTimezone());
        $revision_shift->old_end_time = $end_time->timezone('UTC');
        $revision_shift->save();

        if (isset($old_shift['task'])) {
            foreach ($old_shift['task'] as $old_task) {
                $this->revisionOnDeleteTask($old_task, $old_shift, $revision);
            }
        }
    }
    /**
     * @param $new_task
     * @param $new_shift
     * @param $revision
     */
    private function revisionOnCreateTask($new_task, $new_shift, $revision)
    {
        $revision_shift = new RevisionShift;
        $revision_shift->revision_id = $revision->id;
        $revision_shift->status = CREATE_TASK;
        $revision_shift->roster_id = $new_shift['roster_id'];
        $shift_task = $new_task['pivot'];
        $start_time = new Carbon($shift_task['start_time']);
        $end_time = new Carbon($shift_task['end_time']);
        $revision_shift->new_shift_task_start_time = $start_time;
        $revision_shift->new_shift_task_end_time = $end_time;
        $revision_shift->new_date = $new_shift['date'];
        $revision_shift->shift_task_id = $shift_task['id'];
        $revision_shift->task_id = $new_task['id'];
        $revision_shift->shift_id = $new_shift['id'];
        $revision_shift->new_user_id = $new_shift['user_id'];
        $revision_shift->save();
    }

    /**
     * @param $old_task
     * @param $old_shift
     * @param $revision
     */
    private function revisionOnDeleteTask($old_task, $old_shift, $revision)
    {
        $revision_shift = new RevisionShift;
        $revision_shift->revision_id = $revision->id;
        $revision_shift->status = DELETE_TASK;
        $revision_shift->roster_id = $old_shift['roster_id'];
        $shift_task = $old_task['pivot'];
        $revision_shift->old_date = $old_shift['date'];
        $start_time = new Carbon($shift_task['start_time']);
        $end_time = new Carbon($shift_task['end_time']);
        $revision_shift->old_shift_task_start_time = $start_time;
        $revision_shift->old_shift_task_end_time = $end_time;
        $revision_shift->shift_task_id = $shift_task['id'];
        $revision_shift->task_id = $old_task['id'];
        $revision_shift->shift_id = $old_shift['id'];
        $revision_shift->old_user_id = $old_shift['user_id'];
        $revision_shift->save();
    }

    /**
     * @param $old_task
     * @param $old_shift
     * @param $new_task
     * @param $revision
     */
    private function revisionOnUpdateTask($old_task, $old_shift, $new_task, $new_shift, $revision)
    {

        $revision_shift = new RevisionShift();
        $revision_shift->revision_id = $revision->id;
        $revision_shift->status = UPDATE_TASK;
        $old_shift_task = $old_task['pivot'];
        $new_shift_task = $new_task['pivot'];
        $old_date = new Carbon($old_shift['date']);
        $old_date = $old_date->toDateString();
        $new_date = new Carbon($new_shift['date']);
        $new_date = $new_date->toDateString();
        $revision_shift->old_date = $old_date;
        if ($old_date != $new_date) {
            $revision_shift->new_date = $new_date;
        }
        $old_start_time = new Carbon($old_shift_task['start_time']);
        $new_start_time = new Carbon($new_shift_task['start_time']);
        $revision_shift->old_shift_task_start_time = $old_start_time;
        if ($old_start_time->ne($new_start_time)) {
            $revision_shift->new_shift_task_start_time = $new_start_time;
        }

        $old_end_time = new Carbon($old_shift_task['end_time']);
        $new_end_time = new Carbon($new_shift_task['end_time']);
        $revision_shift->old_shift_task_end_time = $old_end_time;
        if ($old_end_time->ne($new_end_time)) {
            $revision_shift->new_shift_task_end_time = $new_end_time;
        }

        $revision_shift->old_user_id = $old_shift['user_id'];
        if ($old_shift['user_id'] != $new_shift['user_id']) {
            $revision_shift->new_user_id = $new_shift['user_id'];
        }
        $revision_shift->shift_task_id = $old_shift_task['id'];
        $revision_shift->task_id = $old_task['id'];
        $revision_shift->shift_id = $old_shift['id'];
        if (isset($revision_shift->new_shift_task_start_time) || isset($revision_shift->new_shift_task_end_time)
        || isset($revision_shift->new_user_id)) {
            $revision_shift->save();
        }
    }



    /**
     * Fetch newly saved schedule, copied from ScheduleController
     * @param $team_id
     * @param $start_date
     * @param $end_date
     * @return \App\Models\Roster\
     */
    private function retrieveSchedule($team_id, $start_date, $end_date)
    {
        if (isset($team_id, $start_date, $end_date)) {
            try {
                $start_date = new Carbon($start_date);
                $end_date = new Carbon($end_date);
                $schedule = \Roster::where('date_start', '=', $start_date->toDateString())->where('team_id', '=', $team_id)->first();
                if (!isset($schedule)) {
                    $schedule = new \Roster;
                    $schedule->team_id = $team_id;
                    $schedule->date_start = $start_date->toDateString();
                    $schedule->date_ending = $end_date->toDateString();
                    $schedule->roster_stage = 'pending';
                    $schedule->save();
                }
                $schedule = \Roster::where('date_start', '=', $start_date->toDateString())->where('team_id', '=', $team_id)
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
            } catch (\Exception $e) {
                return Helper::jsonLoader(EXCEPTION, array("message" => $e->getMessage(), "line" => $e->getLine(), "file" => $e->getFile()));
            }
            foreach ($schedule->rosteredshift as $key => $shift) {
                if ($shift->rostered_start_time !== '0000-00-00 00:00:00') {
                    $temp = Carbon::parse($shift->rostered_start_time)->timezone(Helper::organisationTimezone())->toDateTimeString();
                    $schedule->rosteredshift[$key]->rostered_start_time = $temp;
                }
                if ($shift->rostered_end_time !== '0000-00-00 00:00:00') {
                    $temp = Carbon::parse($shift->rostered_end_time)->timezone(Helper::organisationTimezone())->toDateTimeString();
                    $schedule->rosteredshift[$key]->rostered_end_time = $temp;
                }
            }
            $schedule = $schedule->toArray();
            $schedule['timezone'] = Carbon::now(Helper::organisationTimezone())->offset / 60;
            return $schedule;
        } else {
            return Helper::jsonLoader(INCORRECT_DATA);
        }
    }
}
