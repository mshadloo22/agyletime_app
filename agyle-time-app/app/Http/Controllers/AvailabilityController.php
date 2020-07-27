<?php
use \App\Models\Roster\User;
use \App\Helper\Helper;
use Carbon\Carbon;
class AvailabilityController extends BaseController
{

    public function __construct()
    {
        $this->beforeFilter('api_auth');
    }


    public function postSpecificUserAvailabilities()
    {
        $input = json_decode(Input::get('data'), true);

        if (isset($input['allDay']))
        {
            $user = Auth::user();
            if ($input['allDay'] == true)
            {
                try
                {
                    $start_date = new Carbon($input['start_date'], Helper::organisationTimezone());
                    $end_date = new Carbon($input['end_date'], Helper::organisationTimezone());
                } catch (Exception $e)
                {
                    return Helper::jsonLoader(EXCEPTION, ['code' => $e->getCode(), 'message' => $e->getMessage(), 'file' => $e->getFile(), 'line' => $e->getLine()]);
                }

                $availability = new AvailSpecific();

                $availability->start_date = $start_date;
                $availability->end_date = $end_date;
                $availability->all_day = true;
                $availability->is_available = false;

                $availability->save();
                $user->availspecific()->attach($availability->id, array('employee_notes' => $input['notes']));

                return Helper::jsonLoader(SUCCESS);

            } else if ($input['allDay'] == false)
            {
                if (isset($input['date']))
                {
                    try
                    {
                        $start_time = new Carbon("$input[date] $input[start_time]", Helper::organisationTimezone());
                        $end_time = new Carbon("$input[date] $input[end_time]", Helper::organisationTimezone());

                        $availability = new AvailSpecific();

                        $availability->start_date = $start_time->copy()->timezone('UTC')->toDateString();
                        $availability->end_date = $end_time->copy()->timezone('UTC')->toDateString();

                        $availability->start_time = $start_time->toTimeString();
                        $availability->end_time = $end_time->toTimeString();

                        $availability->all_day = false;
                        $availability->is_available = false;

                        $availability->save();
                        $user->availspecific()->attach($availability->id, array('employee_notes' => $input['notes']));

                    } catch (Exception $e)
                    {
                        return Helper::jsonLoader(EXCEPTION, ['code' => $e->getCode(), 'message' => $e->getMessage(), 'file' => $e->getFile(), 'line' => $e->getLine()]);
                    }

                    $team = Team::where('id', '=', $user->team_id)->first();
                    $team_leader = User::find($team->team_leader_id);

                    $data = array("full_name" => "$user->first_name $user->last_name");

                    Mail::send('emails.leave_submitted', $data, function ($message) use ($team_leader)
                    {
                        $message->to($team_leader->email, $team_leader->first_name . " " . $team_leader->last_name)->subject('Leave Request');
                    });

                    return Helper::jsonLoader(SUCCESS);

                } else
                {
                    return Helper::jsonLoader(INCORRECT_DATA, "1");
                }
            }

        }
        return Helper::jsonLoader(INCORRECT_DATA, "2");
    }

    public function getAvailabilitiesForApproval()
    {
        $input = Input::all();
        switch (Helper::managementStatus())
        {
            case PRIMARY_CONTACT:
                $team = Team::where('organisation_id', '=', Auth::user()->organisation_id)
                            ->with(array('user' => function ($query) use ($input)
                            {
                                $query->whereHas('availspecific', function ($query) use ($input)
                                {
                                    $query->where('user_avail_spec.authorized', '=', $input['authorized']);

                                })
                                      ->with(array('availspecific' => function ($query) use ($input)
                                      {
                                          $query->where('user_avail_spec.authorized', '=', $input['authorized']);
                                      }));
                            }))->get();
                return Helper::jsonLoader(SUCCESS, $team->toArray());
            case MANAGER:
                $team = Team::where(function ($query)
                {
                    $query->where('team_leader_id', '=', Auth::user()->id)
                          ->orWhere('manager_id', '=', Auth::user()->id);
                })
                            ->with(array('user' => function ($query) use ($input)
                            {
                                $query->whereHas('availspecific', function ($query) use ($input)
                                {
                                    $query->where('user_avail_spec.authorized', '=', $input['authorized']);

                                })
                                      ->with(array('availspecific' => function ($query) use ($input)
                                      {
                                          $query->where('user_avail_spec.authorized', '=', $input['authorized']);
                                      }));
                            }))->get();
                return Helper::jsonLoader(SUCCESS, $team->toArray());
            default:
                return Helper::jsonLoader(UNAUTHORIZED_ACCESS);
        }
    }

    public function postAvailabilitiesForApproval()
    {
        $input = json_decode(Input::get('data'));

        if (!isset($input->id, $input->authorized, $input->user_id))
        {
            return Helper::jsonLoader(INCORRECT_DATA);
        }
        try
        {
            $management_notes = isset($input->management_notes) ? $input->management_notes : "";
            AvailSpecific::find($input->id)->user()->updateExistingPivot($input->user_id, ['authorized' => $input->authorized, 'management_notes' => $management_notes]);
        } catch (Exception $e)
        {
            return Response::make(json_encode(array('result' => EXCEPTION, 'message' => $e->getMessage(), 'data' => array())), 200, array('Content-Type' => 'application/json'));
        }

        $avail = AvailSpecific::where('id', '=', $input->id)
                              ->with(array('User' => function ($query) use ($input)
                              {
                                  $query->where('id', '=', $input->user_id);
                              }))
                              ->first();

        if ($input->authorized == 'approved' || $input->authorized == 'denied')
        {
            $data['authorized'] = $input->authorized;
            $data['avail'] = $avail->toArray();
            $data['management_notes'] = $input->management_notes;

            Mail::send("emails.leave_$data[authorized]", $data, function ($message) use ($avail)
            {
                $authorized = ucfirst($avail->authorized);
                $message->to($avail->user[0]->email, $avail->user[0]->first_name . " " . $avail->user[0]->last_name)->subject("Leave $authorized");
            });
        }

        return Helper::jsonLoader(SUCCESS);
    }

    public function approve_leave()
    {
        return View::make('approve_leave');
    }

    public function user_availabilities_general()
    {
        $input = Input::all();
        $user = User::find($input['id']);

        if (isset($input['availabilities']))
        {
            $input = $input['availabilities'];
        } else
        {
            return Redirect::back()
                           ->with('flash_error', 'Incorrect data sent to server. If error persists please contact your Administrator');
        }

        foreach ($input as $weekday => $day_times)
        {
            if ($day_times['start_time'] != "" && $day_times['end_time'] != "")
            {
                $start_time = explode(':', $day_times['start_time']);
                while (count($start_time) < 2) $start_time[] = '00';
                $start_time = Carbon::createFromTime($start_time[0], $start_time[1], 0, Helper::organisationTimezone());

                $end_time = explode(':', $day_times['end_time']);
                while (count($end_time) < 2) $end_time[] = '00';
                $end_time = Carbon::createFromTime($end_time[0], $end_time[1], 0, Helper::organisationTimezone());

                if ($start_time->diffInMinutes($end_time) > 0)
                {


                    $avail_table = AvailGeneral::where('start_time', '=', $start_time->copy()->timezone(Config::get('app.timezone'))->toTimeString())
                                               ->where('end_time', '=', $end_time->copy()->timezone(Config::get('app.timezone'))->toTimeString())
                                               ->where('day', '=', $weekday)
                                               ->first();

                    if (isset($avail_table))
                    {
                        $old_avail_table = $user->availgeneral()->where('avail_general.day', '=', $weekday)->first();
                        if (isset($old_avail_table))
                        {
                            User::find($user->id)->availgeneral()->detach($old_avail_table->id);
                        }
                        $user->availgeneral()->attach($avail_table->id);
                    } else
                    {

                        $avail_table = $user->availgeneral()->where('avail_general.day', '=', $weekday)->first();
                        if (isset($avail_table))
                        {
                            User::find($user->id)->availgeneral()->detach($avail_table->id);
                        }
                        $avail_table = new AvailGeneral();
                        $avail_table->day = $weekday;
                        $avail_table->start_time = $start_time->toTimeString();
                        $avail_table->end_time = $end_time->toTimeString();
                        $avail_table->save();

                        $user->availgeneral()->attach($avail_table->id);
                    }
                }
            } else if ($day_times['start_time'] == "" && $day_times['end_time'] == "")
            {

                $avail_table = $user->availgeneral()->where('avail_general.day', '=', $weekday)->first();
                if (isset($avail_table))
                {
                    User::find($user->id)->availgeneral()->detach($avail_table->id);
                }
            } else
            {
                return Redirect::back()
                               ->with('flash_error', 'Incorrect data sent to server. Please ensure both the start and end times are filled out');
            }
        }

        return Redirect::back()
                       ->with('flash_notice', 'User Availabilities updated.');
    }
}
