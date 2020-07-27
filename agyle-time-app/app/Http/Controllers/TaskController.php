<?php
use \App\Helper\Helper;
use \App\Helper\Util;
use Carbon\Carbon;
class TaskController extends BaseController
{
    public function __construct()
    {
        $this->beforeFilter('api_auth');
    }

    public function manage_tasks()
    {
        return View::make('manage_tasks');
    }

    public function getTasks()
    {
        $tasks = Task::where('organisation_id', '=', Auth::user()->organisation_id)
                     ->get();

        return Helper::jsonLoader(SUCCESS, $tasks->toArray());
    }

    public function getSchedulableTasks()
    {
        $tasks = Task::where('organisation_id', '=', Auth::user()->organisation_id)
                     ->where('planned', '=', true)
                     ->get();

        return Helper::jsonLoader(SUCCESS, $tasks->toArray());
    }

    public function getUnschedulableTasks()
    {
        $tasks = Task::where('organisation_id', '=', Auth::user()->organisation_id)
                     ->where('planned', '=', false)
                     ->get();

        return Helper::jsonLoader(SUCCESS, ['tasks' => $tasks->toArray(), 'idle_timeout' => 300]);
    }

    public function postTask()
    {
        $input = Input::all();

        if (isset($input['name'], $input['identifier'], $input['available'], $input['paid'], $input['planned'], $input['timeout'], $input['color']))
        {
            try
            {
                $task = Task::firstOrNew(array('identifier' => $input['identifier'], 'organisation_id' => Auth::user()->organisation_id));

                $task->name = $input['name'];

                if (isset($input['description']))
                    $task->description = $input['description'];

                $task->available = $input['available'];
                $task->paid = $input['paid'];
                $task->planned = $input['planned'];
                $task->leave = $input['leave'];
                $task->break = $input['break'];
                $task->timeout = $input['timeout'];

                if ($input['timeout']) Task::where('organisation_id', '=', Auth::user()->organisation_id)
                                           ->where('timeout', '=', true)
                                           ->update(array('timeout' => false));

                $task->color = $input['color'];

                $task->save();

            } catch (Exception $e)
            {
                return Helper::jsonLoader(EXCEPTION, $e->getMessage());
            }
            return Helper::jsonLoader(SUCCESS);
        } else
        {
            return Helper::jsonLoader(INCORRECT_DATA);
        }
    }

    public function postTasks()
    {
        $inputArray = Input::all();
        $inputArray = json_decode($inputArray['data'], true);
        foreach ($inputArray as $input)
        {
            if (isset($input['name'], $input['identifier'], $input['available'], $input['paid'], $input['planned'], $input['timeout'], $input['color']))
            {
                try
                {

                    if (Util::mempty($input['name'], $input['identifier']))
                    {
                        continue;
                    }
                    if (!empty($input['identifier']))
                        $task = Task::firstOrNew(array('identifier' => $input['identifier'], 'organisation_id' => Auth::user()->organisation_id));
                    else
                        $task = new Task();

                    $task->name = $input['name'];

                    if (isset($input['description']) && !empty($input['description']))
                        $task->description = $input['description'];

                    $task->available = $input['available'];
                    $task->paid = $input['paid'];
                    $task->planned = $input['planned'];
                    $task->leave = $input['leave'];
                    $task->break = $input['break'];
                    $task->timeout = $input['timeout'];

                    if (empty($task->identifier))
                    {
                        $task->identifier = $input['identifier'];
                    }
                    if (empty($task->organisation_id))
                    {
                        $task->organisation_id = Auth::user()->organisation_id;
                    }

                    if ($input['timeout'])
                        Task::where('organisation_id', '=', Auth::user()->organisation_id)
                            ->where('timeout', '=', true)
                            ->update(array('timeout' => false));

                    $task->color = str_replace('#', '', $input['color']);

                    $task->save();

                } catch (Exception $e)
                {
                    return Helper::jsonLoader(EXCEPTION, $e->getMessage());
                }
            } else
            {
                return Helper::jsonLoader(INCORRECT_DATA);
            }
        }
        return Helper::jsonLoader(SUCCESS);
    }

    public function postTaskData()
    {
        $errors = array();

        if (Input::has('task'))
        {
            $inputs = array(Input::get('task'));
        } else if (Input::has('tasks'))
        {
            $inputs = Input::get('tasks');
        } else
        {
            return Helper::jsonLoader(INCORRECT_DATA);
        }

        foreach ($inputs as $input)
        {
            if (isset($input['oxcode']))
            {
                $task = Task::where('identifier', '=', $input['oxcode'])
                            ->where('organisation_id', '=', Auth::user()->organisation_id)
                            ->first();
            } else
            {
                $errors['tasks'][] = "Incorrect data sent to API function";
            }

            if (isset($task))
            {
                if (isset($input['identifier']))
                {
                    $task_data = TaskData::where('identifier', '=', $input['identifier'])->where('task_id', '=', $task->id)->first();
                    if (!isset($task_data))
                    {
                        $task_data = new TaskData;
                        $task_data->identifier = $input['identifier'];
                        $task_data->task_id = $task->id;
                        $task_data->organisation_id = $task->organisation_id;
                    }

                    if (isset($input['start_time']))
                        $task_data->start_time = new Carbon($input['start_time'], Helper::organisationTimezone());

                    if (isset($input['end_time']))
                        $task_data->end_time = new Carbon($input['end_time'], Helper::organisationTimezone());

                    if (isset($input['shift_tasks_id']))
                        $task_data->shift_tasks_id = $input['shift_tasks_id'];

                    $task_data->handle_time = isset($input['handle_time']) ? $input['handle_time'] : 0;

                    $task_data->agent_alias = isset($input['agent_alias']) ? $input['agent_alias'] : Auth::user()->id;

                    try
                    {
                        $task_data->save();
                    } catch (Exception $e)
                    {
                        $errors['tasks'][] = "Exception Saving Task Data: " . $e->getMessage();
                    }
                } else
                {
                    $errors['tasks'][] = "Task missing identifier";
                }
            }

        }
        return Helper::jsonLoader(SUCCESS, isset($errors) ? $errors : array());
    }

    public function postRosteredTask()
    {
        $input = Input::all();

        try
        {
            $shift_task_model = new ShiftTask;
            $shift_task_model->task_id = Task::where('organisation_id', '=', Auth::user()->organisation_id)
                                             ->where('identifier', '=', $input['identifier'])
                                             ->first()->id;
            $shift_task_model->rostered_shift_id = $input['task']['data']['db_id'];

            $shift_task_model->start_time = new Carbon($input['from'], Helper::organisationTimezone());
            $shift_task_model->end_time = new Carbon($input['to'], Helper::organisationTimezone());
            $shift_task_model->added_by = Auth::user()->id;

            $shift_task_model->save();
        } catch (Exception $e)
        {
            return Helper::jsonloader(EXCEPTION, ['code' => $e->getCode(), 'message' => $e->getMessage()]);
        }

        return Helper::jsonLoader(SUCCESS);
    }

    public function getScheduledTasks()
    {
        $date = Input::has('date') ? new Carbon(Input::get('date'), Helper::organisationTimezone()) : new Carbon(Helper::organisationTimezone());

        $shift = RosteredShift::where('user_id', '=', Auth::user()->id)
                              ->where('date', '=', $date->toDateString())
                              ->with('task')
                              ->first(array('id', 'rostered_start_time', 'rostered_end_time'));

        if (isset($shift))
        {
            return Helper::jsonLoader(SUCCESS, $shift->toArray());
        } else
        {
            return Helper::jsonLoader(DATA_NOT_FOUND);
        }

    }
}