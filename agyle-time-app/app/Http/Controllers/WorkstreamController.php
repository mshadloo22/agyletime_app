<?php
use \App\Helper\Helper;
use Carbon\Carbon;
class WorkstreamController extends BaseController
{

    public function __construct()
    {
        $this->beforeFilter('api_auth');
    }

    public function manage_workstreams()
    {
        return View::make('manage_workstreams');
    }

    public function getWorkstream()
    {
        if (Input::has('workstream_id'))
        {
            $workstream = Workstream::where('id', '=', Input::get('workstream_id'))
                                    ->where('organisation_id', '=', Auth::user()->organisation_id)
                                    ->first();
        } else if (Input::has('workstream_name'))
        {
            $workstream = Workstream::where('name', '=', Input::get('workstream_name'))
                                    ->where('organisation_id', '=', Auth::user()->organisation_id)
                                    ->first();
        } else
        {
            $workstream = Workstream::where('organisation_id', '=', Auth::user()->organisation_id)
                                    ->get();
        }

        if (isset($workstream))
        {
            return Helper::jsonLoader(SUCCESS, $workstream->toArray());
        } else
        {
            return Helper::jsonLoader(DATA_NOT_FOUND);
        }
    }

    public function postWorkstream()
    {
        If (Input::has('workstream'))
        {
            $input = Input::get('workstream');
        } else
        {
            return Helper::jsonLoader(INCORRECT_DATA);
        }
        try
        {
            if (isset($input['id']))
            {
                $workstream = Workstream::where('id', '=', $input['id'])
                                        ->where('organisation_id', '=', Auth::user()->organisation_id)
                                        ->first();
            } else
            {
                $workstream = Workstream::firstOrCreate(array('name' => $input['name'], 'organisation_id' => Auth::user()->organisation_id));
            }

            if (isset($workstream))
            {
                if (isset($input['name']))
                    $workstream->name = $input['name'];

                if (isset($input['description']))
                    $workstream->description = $input['description'];

                if (isset($input['role_id']))
                    $workstream->role_id = $input['role_id'];

                if (isset($input['wait_time_threshold']))
                    $workstream->wait_time_threshold = $input['wait_time_threshold'];

                if (isset($input['grade_of_service']))
                    $workstream->grade_of_service = $input['grade_of_service'];
            }

            $workstream->save();
        } catch (Exception $e)
        {
            return Helper::jsonLoader(EXCEPTION, ['exception' => $e->getMessage()]);
        }

        return Helper::jsonLoader(SUCCESS);
    }

    public function postWorkstreams()
    {
        $inputArray = Input::all();
        $inputArray = json_decode($inputArray['data'], true);

        foreach ($inputArray as $input)
        {
            try
            {
                if (isset($input['id']))
                {
                    $workstream = Workstream::where('id', '=', $input['id'])
                                            ->where('organisation_id', '=', Auth::user()->organisation_id)
                                            ->first();
                } else
                {
                    $workstream = Workstream::firstOrCreate(array('name' => $input['name'], 'organisation_id' => Auth::user()->organisation_id));
                }

                if (isset($workstream))
                {
                    if (isset($input['name']))
                        $workstream->name = $input['name'];

                    if (isset($input['description']))
                        $workstream->description = $input['description'];

                    if (isset($input['role_id']))
                        $workstream->role_id = $input['role_id'];

                    if (isset($input['color']))
                        $workstream->color = $input['color'];

                    if (isset($input['aht_goal']))
                        $workstream->aht_goal = $input['aht_goal'];

                    if (isset($input['abandon_threshold']))
                        $workstream->abandon_threshold = $input['abandon_threshold'];

                    if (isset($input['wait_time_threshold']))
                        $workstream->wait_time_threshold = $input['wait_time_threshold'];

                    if (isset($input['forecast_method_id']))
                        $workstream->forecast_method_id = $input['forecast_method_id'];

                    if (isset($input['grade_of_service']))
                        $workstream->grade_of_service = $input['grade_of_service'];
                }

                $workstream->save();
            } catch (Exception $e)
            {
                return Helper::jsonLoader(EXCEPTION, ['exception' => $e->getMessage()]);
            }
        }

        return Helper::jsonLoader(SUCCESS);
    }

    public function getRoleWorkstreams()
    {
        if (!Input::has('role_id')) return Helper::jsonLoader(INCORRECT_DATA);

        $workstreams = Workstream::whereOrganisationId(Auth::user()->organisation_id)
                                 ->whereRoleId(Input::get('role_id'))->get();

        return Helper::jsonLoader(SUCCESS, $workstreams->toArray());
    }

    public function getSubtask()
    {
        if (Input::has('subtask_id'))
        {
            $subtask = Subtask::where('id', '=', Input::get('subtask_id'))
                              ->where('organisation_id', '=', Auth::user()->organisation_id)
                              ->first();
        } else if (Input::has('subtask_name'))
        {
            $subtask = Subtask::where('id', '=', Input::get('subtask_name'))
                              ->where('organisation_id', '=', Auth::user()->organisation_id)
                              ->first();
        } else
        {
            return Helper::jsonLoader(INCORRECT_DATA);
        }

        if (isset($subtask))
        {
            return Helper::jsonLoader(SUCCESS, $subtask->toArray());
        } else
        {
            return Helper::jsonLoader(DATA_NOT_FOUND);
        }
    }

    public function postSubtask()
    {
        if (Input::has('subtask'))
        {
            $input = Input::get('subtask');
        } else
        {
            return Helper::jsonLoader(INCORRECT_DATA);
        }

        if (isset($input['workstream_id']))
        {
            $workstream = Workstream::where('id', '=', $input['workstream_id'])
                                    ->where('organisation_id', '=', Auth::user()->organisation_di)
                                    ->first();
        }

        if (isset($workstream))
        {
            if (isset($input['id']))
            {
                $subtask = Subtask::where('id', '=', $input['id'])
                                  ->where('workstream_id', '=', $workstream->id)
                                  ->first();
            } else if (isset($input['name']))
            {
                $subtask = Subtask::where('name', '=', $input['name'])
                                  ->where('workstream_id', '=', $workstream->id)
                                  ->first();
            } else
            {
                $subtask = new Subtask;
                $subtask->workstream_id = $workstream->id;
            }

            if (isset($subtask))
            {
                if (isset($input['name']))
                    $subtask->name = $input['name'];

                if (isset($input['description']))
                    $subtask->description = $input['description'];
            }

            try
            {
                $subtask->save();
            } catch (Exception $e)
            {
                return Helper::jsonLoader(EXCEPTION, ['exception' => $e->getMessage()]);
            }


        } else
        {
            return Helper::jsonLoader(INCORRECT_DATA);
        }

        return Helper::jsonLoader(SUCCESS);
    }

    public function getWorkstreamData()
    {

    }

    /*
     * Accepts workstream data with the following structure:
     * organisation = [organisation_id]
     * api_token = [api_token]
     * workstream[workstream_id] = workstream_id
     * workstream[start_time] = start_time
     * workstream[end_time] = end_time
     * workstream[wait_time] = wait_time
     * workstream[handle_time] = handle_time
     * workstream[agent_alias] = agent_alias
     */
    public function postWorkstreamData()
    {
        $errors = array();

        if (Input::has('workstream'))
        {
            $inputs = array(Input::get('workstream'));
        } else if (Input::has('workstreams'))
        {
            $inputs = Input::get('workstreams');
        } else
        {
            return Helper::jsonLoader(INCORRECT_DATA);
        }

        foreach ($inputs as $input)
        {
            if (isset($input['workstream_id']))
            {
                $workstream = Workstream::where('id', '=', $input['workstream_id'])
                                        ->where('organisation_id', '=', Auth::user()->organisation_id)
                                        ->first();
            } else if (isset($input['workstream_name']))
            {
                $workstream = Workstream::where('name', '=', $input['workstream_name'])
                                        ->where('organisation_id', '=', Auth::user()->organisation_id)
                                        ->first();
            } else
            {
                $errors['workstreams'][] = "Incorrect data sent to API function";
            }
            if (isset($workstream))
            {
                if (isset($input['identifier']))
                {
                    $workstream_data = WorkstreamData::compositeKey($input['identifier'], $workstream->id)->first();
                    if (!isset($workstream_data))
                    {
                        $workstream_data = new WorkstreamData;
                        $workstream_data->identifier = $input['identifier'];
                    }

                    if (isset($input['start_time']))
                        $workstream_data->start_time = new Carbon($input['start_time'], Helper::organisationTimezone());

                    if (isset($input['end_time']))
                        $workstream_data->end_time = new Carbon($input['end_time'], Helper::organisationTimezone());

                    $time_to_kill = new Carbon(Helper::organisationTimezone());
                    $time_to_kill->tomorrow();
                    $workstream_data->time_to_kill = $time_to_kill;
                    $workstream_data->workstream_id = $workstream->id;
                    $workstream_data->organisation_id = $workstream->organisation_id;

                    if (isset($input['wait_time']))
                    {
                        $workstream_data->wait_time = $input['wait_time'];
                        if ($input['wait_time'] <= $workstream->wait_time_threshold)
                        {
                            $workstream_data->under_threshold = true;
                        }
                    } else
                    {
                        $workstream_data->wait_time = 0;
                    }

                    if (isset($input['handle_time']))
                    {
                        $workstream_data->handle_time = $input['handle_time'];
                    } else
                    {
                        $workstream_data->handle_time = 0;
                    }

                    if (isset($input['agent_alias']))
                        $workstream_data->agent_alias = $input['agent_alias'];

                    if (isset($input['subtasks']))
                        $errors['subtasks'] = $this->createSubtaskData($input['subtasks']);

                    try
                    {
                        $workstream_data->save();
                    } catch (Exception $e)
                    {
                        $errors['workstreams'][] = "Exception Saving Workstream Data: " . $e->getMessage();
                    }
                } else
                {
                    $errors['workstreams'][] = "Workstream missing identifier";
                }
            }

        }
        return Helper::jsonLoader(SUCCESS, isset($errors) ? $errors : array());
    }

    private function createSubtaskData($subtasks)
    {
        $subtasks = is_array($subtasks) ? $subtasks : array($subtasks);

        $errors = array();

        foreach ($subtasks as $subtask)
        {
            if ($subtask['subtask_id'])
            {
                $subtask = Subtask::where('id', '=', $subtask['subtask_id'])
                                  ->where('organisation_id', '=', Auth::user()->organisation_id)
                                  ->first();

                if (isset($input['identifier']))
                {
                    $subtask_data = SubtaskData::compositeKey($input['identifier'], $subtask->id)->first();
                    if (!isset($subtask_data))
                    {
                        $subtask_data = new SubtaskData;
                        $subtask_data->identifier = $input['identifier'];
                    }

                    if (isset($subtask['start_time']))
                        $subtask_data->start_time = new Carbon($subtask['start_time'], Helper::organisationTimezone());

                    if (isset($subtask['end_time']))
                        $subtask_data->end_time = new Carbon($subtask['end_time'], Helper::organisationTimezone());

                    $time_to_kill = new Carbon(Helper::organisationTimezone());
                    $time_to_kill->tomorrow();
                    $subtask_data->time_to_kill = $time_to_kill;
                    $subtask_data->workstream_id = $subtask->id;
                    $subtask_data->organisation_id = $subtask->organisation_id;

                    if (isset($subtask['handle_time']))
                    {
                        $subtask_data->handle_time = $subtask['wait_time'];
                    } else
                    {
                        $subtask_data->handle_time = 0;
                    }

                    if (isset($subtask['agent_alias']))
                        $subtask_data->agent_alias = $subtask['agent_alias'];

                    try
                    {
                        $subtask_data->save();
                    } catch (Exception $e)
                    {
                        $errors[] = $e->getMessage();
                    }
                } else
                {
                    $errors[] = "Subtask missing identifier";
                }
            }
        }
        return $errors;
    }

    public function getForecastMethods()
    {
        return Helper::jsonLoader(SUCCESS, ForecastMethod::get()->toArray());
    }

    public function getRealtimeWorkstreamAverages()
    {
        $input = json_decode(Input::all());

        if (isset($input['workstream_ids']))
        {

        }

        return Helper::jsonLoader(SUCCESS);
    }

    public function getBrokenWorkstreamData()
    {
        $data = WorkstreamData::whereOrganisationId(Auth::user()->organisation_id)
                              ->where(function ($query)
                              {
                                  if (!Input::has('all_time')) $query->where('created_at', '>=', Carbon::now()->subDay()->toDateTimeString());
                              })->where(function ($query)
            {
                $query->whereStartTime('0000-00-00 00:00:00')
                      ->orWhere('end_time', '=', '0000-00-00 00:00:00');
            })->get(array('identifier'));

        return Helper::jsonLoader(SUCCESS, Helper::flattenArray($data->toArray()));
    }


}


?>