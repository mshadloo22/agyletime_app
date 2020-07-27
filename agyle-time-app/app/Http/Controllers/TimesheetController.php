<?php
use \App\Helper\Helper;
use \App\Models\Roster\User;
use Carbon\Carbon;
class TimesheetController extends BaseController
{

    public function edit_timesheet()
    {
        return View::make('edit_timesheet');
    }

    public function approve_timesheet()
    {
        return View::make('approve_timesheet');
    }

    public function view_timesheet_details()
    {
        return View::make('view_timesheet_details');
    }

    public function getTimesheet()
    {
        if (Input::has('date'))
        {
            $date = Input::get('date');
        } else
        {
            return Helper::jsonLoader(INCORRECT_DATA);
        }

        $user_id = Input::has('user_id') ? Input::get('user_id') : Auth::user()->id;
        $user = User::where('user.id', '=', $user_id)
                    ->with(array('payrate' => function ($query)
                    {
                        $query->where('user_pay_rate.end_date', '=', null);
                    }))
                    ->first(array('id', 'email', 'first_name', 'last_name'));

        $start_date = new Carbon($date, Helper::organisationTimezone());
        $end_date = new Carbon($date, Helper::organisationTimezone());
        $start_date->startOfWeek();
        $end_date->endOfWeek();

        $timesheet = Timesheet::where('date_end', '=', $end_date->toDateString())
                              ->where('user_id', '=', $user->id)
                              ->with('timesheetshift')
                              ->with('timesheetshift.timesheetbreak')
                              ->first();

        if (!isset($timesheet)) $timesheet = $this->blankTimesheet($user->id, $start_date, $end_date);

        if ($user_id == Auth::user()->id && $timesheet->approval_stage === 'unopened')
        {
            $timesheet->approval_stage = 'not submitted';
            $timesheet->save();
        }

        $data['user'] = $user->toArray();
        $data['timesheet'] = $timesheet->toArray();

        if (!isset($data['timesheet']['timesheetshift']))
            $data['timesheet']['timesheetshift'] = array();

        return Helper::jsonLoader(SUCCESS, $data);
    }

    public function postTimesheet()
    {
        $input = Input::get('data');
        $input = json_decode($input, true);

        if (isset($input['timesheet']))
        {
            $timesheet = Timesheet::find($input['timesheet']['id']);
            $timesheet->approval_stage = $input['timesheet']['approval_stage'];
            if (isset($input['timesheet']['notes']))
                $timesheet->notes = $input['timesheet']['notes'];

            $timesheet->user_worked = $input['timesheet']['user_worked'];
            $timesheet->save();

            foreach ($input['shifts'] as $shift)
            {
                if ($shift != NULL)
                {
                    if (isset($shift['destroy']))
                    {
                        TimesheetShift::destroy($shift['shift_id']);
                    } else
                    {
                        $day_start = Carbon::parse($shift['start_time'], Helper::organisationTimezone())->startOfDay()->timezone(Config::get('app.timezone'));
                        $day_end = Carbon::parse($shift['finish_time'], Helper::organisationTimezone())->endOfDay()->timezone(Config::get('app.timezone'));
                        if ($shift['shift_id'] != '')
                        {
                            $shift_model = TimesheetShift::find($shift['shift_id']);
                        } else
                        {
                            $shift_model = TimesheetShift::where('timesheet_id', '=', $input['timesheet']['id'])->whereBetween('start_time', array($day_start, $day_end))->first();
                            if (!isset($shift_model))
                            {
                                $shift_model = new TimesheetShift;
                                $shift_model->timesheet_id = $input['timesheet']['id'];
                            }
                        }
                        $shift_model->start_time = new Carbon($shift['start_time'], Helper::organisationTimezone());
                        $shift_model->finish_time = new Carbon($shift['finish_time'], Helper::organisationTimezone());
                        $shift_model->number_of_units = $shift['number_of_units'];
                        $shift_model->notes = $shift['notes'];
                        $shift_model->save();

                        $break_model = TimesheetBreak::where('timesheet_shift_id', '=', $shift_model->id)->first();
                        if (!isset($break_model))
                        {
                            $break_model = new TimesheetBreak;
                            $break_model->timesheet_shift_id = $shift_model->id;
                        }
                        $break_model->break_length = $shift['break'];
                        $break_model->save();

                    }
                }
            }

            if ($timesheet->approval_stage == 'submitted')
            {
                $team = Team::find(Auth::user()->team_id);
                $team_leader = User::find($team->team_leader_id);
                $data = array('date' => $timesheet->date_end, 'employee' => Auth::user()->first_name);
                Mail::send('emails.timesheet_submitted', $data, function ($message) use ($team_leader)
                {
                    $message->to($team_leader->email, $team_leader->first_name . " " . $team_leader->last_name)->subject('Timesheet Submitted');
                });
            }
            return Helper::jsonLoader(SUCCESS, $input['timesheet']['approval_stage']);
        }
        return Helper::jsonLoader(INCORRECT_DATA);

    }

    public function getTimesheetsForApproval()
    {
        $team_id = Input::get('team_id');
        $start_date = Input::get('start_date');
        $end_date = Input::get('end_date');
        $approval_stage = Input::get('approval_stage');

        $start_date = (isset($start_date)) ? new Carbon($start_date, Helper::organisationTimezone()) : null;
        $end_date = (isset($end_date)) ? new Carbon($end_date, Helper::organisationTimezone()) : null;


        $team_obj = Team::managedTeams()
                        ->where(function ($query) use ($team_id)
                        {
                            if (isset($team_id)) $query->where('id', '=', $team_id);
                        })
                        ->with(array('user' => function ($query) use ($start_date, $end_date, $approval_stage)
                        {
                            $query->with(array('timesheet' => function ($query) use ($start_date, $end_date, $approval_stage)
                            {
                                if (isset($approval_stage)) $query->where('approval_stage', '=', $approval_stage);
                                if (isset($start_date)) $query->where('date_start', '>=', $start_date->startOfWeek()->toDateString());
                                if (isset($end_date)) $query->where('date_end', '<=', $end_date->endOfWeek()->toDateString());
                                if (!Input::has('with_not_submitted')) $query->where('approval_stage', '<>', 'not submitted')
                                                                             ->where('approval_stage', '<>', 'unopened');
                                $query->with(array('timesheetshift' => function ($query)
                                {
                                    $query->with('timesheetbreak');
                                }))
                                      ->with('integration');
                            }))
                                  ->whereHas('timesheet', function ($query) use ($start_date, $end_date, $approval_stage)
                                  {
                                      if (isset($approval_stage)) $query->where('approval_stage', '=', $approval_stage);
                                      if (isset($start_date)) $query->where('date_start', '>=', $start_date->startOfWeek()->toDateString());
                                      if (isset($end_date)) $query->where('date_end', '<=', $end_date->endOfWeek()->toDateString());
                                      if (!Input::has('with_not_submitted')) $query->where('approval_stage', '<>', 'not submitted')
                                                                                   ->where('approval_stage', '<>', 'unopened');
                                  })
                                  ->with(array('integration' => function ($query)
                                  {
                                      $query->where('name', '=', 'Xero');
                                  }))
                                  ->with(array('payrate' => function ($query)
                                  {
                                      $query->where('user_pay_rate.end_date', '=', null);
                                  }));
                        }))
                        ->get();


        $teams = $team_obj->toArray();

        foreach ($teams as $t_key => $team)
        {
            foreach ($team['user'] as $u_key => $user)
            {
                foreach ($user['timesheet'] as $time_key => $timesheet)
                {
                    $teams[$t_key]['user'][$u_key]['timesheet'][$time_key]['rostered_hours'] = $this->getUserHours($user['id'], $timesheet['date_start']);
                }

            }
        }

        return Helper::jsonLoader(SUCCESS, $teams);
    }

    private function getUserHours($user_id, $date)
    {
        $date = new Carbon($date);
        $start_date = $date->copy()->startofWeek();
        $end_date = $date->copy()->endOfWeek();

        $shifts = RosteredShift::where('user_id', '=', $user_id)
                               ->with('shifttask.task')
                               ->where('date', '<=', $end_date->toDateString())
                               ->where('date', '>=', $start_date->toDateString())
                               ->get();
        $total_hours = 0;
        foreach ($shifts as $shift)
        {
            $total_hours += $shift->rostered_start_time->diffInMinutes($shift->rostered_end_time, true) / 60;
            foreach ($shift->shifttask as $task)
            {
                if ($task->task->break)
                {
                    $total_hours -= $task->start_time->diffInMinutes($task->end_time, true) / 60;
                }
            }
        }

        return $total_hours;
    }

    public function postTimesheetsForApproval()
    {
        $input = Input::get('data');
        $input = json_decode($input, true);
        if (isset($input['timesheet_id'], $input['approval_stage']))
        {
            $timesheet = Timesheet::find($input['timesheet_id']);
            $timesheet->approval_stage = $input['approval_stage'];
            $timesheet->notes = $input['notes'];
            $timesheet->save();
            $user = $timesheet->user;

            $data = array('date' => $timesheet->date_end, 'notes' => $timesheet->notes);

            if ($input['approval_stage'] == 'approved' || $input['approval_stage'] == 'denied' || $input['approval_stage'] == 'canceled')
            {
                Mail::send('emails.timesheet_' . $input['approval_stage'], $data, function ($message) use ($user, $input)
                {
                    $message->to($user->email, $user->first_name . " " . $user->last_name)->subject('Timesheet ' . ucfirst($input['approval_stage']));
                });
            }

            return Helper::jsonLoader(SUCCESS);
        } else
        {
            return Helper::jsonLoader(INCORRECT_DATA);
        }
    }

    public function postTimesheetReminder()
    {
        if (!Input::has('timesheet_id')) return Helper::jsonLoader(INCORRECT_DATA);

        $timesheet = Timesheet::where('id', '=', Input::get('timesheet_id'))->with('user')->first();

        if (isset($timesheet))
        {
            Email::sendTimesheetReminder($timesheet, $timesheet->user);
            return Helper::jsonLoader(SUCCESS);
        }

        return Helper::jsonLoader(DATA_NOT_FOUND);
    }

    public function getApproveTimesheet()
    {

    }

    public function getReset()
    {
        if (App::environment() == 'demo')
        {
            $timesheets = Timesheet::where('date_start', '>', '2014-06-28')->with('integration')->get();

            foreach ($timesheets as $timesheet)
            {
                $timesheet->approval_stage = "submitted";
                $timesheet->integration[0]->pivot->sent = false;
                $timesheet->integration[0]->pivot->save();
                $timesheet->save();
            }
        }
    }

    private function blankTimesheet($user_id, Carbon $start_date, Carbon $end_date)
    {
        $timesheet = new Timesheet;
        $timesheet->user_id = $user_id;
        $timesheet->date_start = $start_date->toDateString();
        $timesheet->date_end = $end_date->toDateString();
        $timesheet->approval_stage = 'not submitted';
        $timesheet->save();
        $timesheet->integration()->attach(1, array('sent' => 0));

        return $timesheet;
    }


    public function get_timesheet_pdf($timesheet_id)
    {

        //Get timesheet
        $timesheet = Timesheet::where('id', '=', $timesheet_id)
                              ->with('timesheetshift')
                              ->with('timesheetshift.timesheetbreak')
                              ->first();

        //Get timesheets user with payrates (for pay rate type)
        $user = User::where('user.id', '=', $timesheet->user_id)
                    ->with(array('payrate' => function ($query)
                    {
                        $query->where('user_pay_rate.end_date', '=', null);
                    }))
                    ->first();

        //Init Variables
        $unit_type = isset($user->payrate) ? $user->pay_rate[0]->unit_type : null;
        $rostered_hours = 0;
        $submitted_hours = 0;
        $submitted_days = 0;

        //Calculate hours worked by getting date differences in hours
        foreach ($timesheet->timesheetshift as $shift)
        {
            $submitted_hours += $shift->getDurationInHours();
            $submitted_hours -= $shift->getBreakDurationInHours();
            $submitted_days += 1;
        }

        //Get start of the week date and end of week date
        $date = new Carbon($timesheet->date_start, Helper::organisationTimezone());

        $start_date = $date->copy()->startOfWeek();
        $end_date = $date->copy()->endOfWeek();

        //Get rostered shifts
        $shifts = RosteredShift::where('user_id', '=', $user->id)
                               ->where('date', '<=', $end_date->toDateString())
                               ->where('date', '>=', $start_date->toDateString())
                               ->get();
        foreach ($shifts as $shift)
        {
            $hours = $shift->getDurationInHours();
            $rostered_hours += $hours;
            if ($hours >= 5)
            {
                $rostered_hours -= 0.5;
            }
        }

        //Create ordered arrays of timesheets and shifts
        $timesheet_ordered_shifts = array();
        $rostered_ordered_shifts = array();
        $start_date->subDays(1);
        for ($i = 0; $i < 7; $i++)
        {
            $timesheet_ordered_shifts[$start_date->addDays(1)->toDateString()] = new TimesheetShift();
            $rostered_ordered_shifts[$start_date->toDateString()] = new RosteredShift();
        }

        //Fill in ordered arrays of timesheets and shifts
        foreach ($timesheet->timesheetshift as $shift)
        {
            $date = $shift->start_time->copy()->timezone(Helper::organisationTimezone('timezone'));
            $timesheet_ordered_shifts[$date->toDateString()] = $shift->setTimezone(Helper::organisationTimezone());
        }
        $timesheet->timesheetshift = $timesheet_ordered_shifts;

        foreach ($shifts as $shift)
        {
            $date = $shift->rostered_start_time->copy()->timezone(Helper::organisationTimezone('timezone'));
            $rostered_ordered_shifts[$date->toDateString()] = $shift->setTimezone(Helper::organisationTimezone());
        }

        //Generate PDF
        $options = array(
            'orientation' => 'Landscape',
            'disable-javascript',
            'page-size' => 'A4',
            'title' => 'Timesheet ' . $end_date->toDateString() . ' - ' . $user->first_name . ' ' . $user->last_name,
            'page-width' => 600,
            'page-height' => 300

        );
        $pdf = PDF::make();

        $pdf->setOptions($options);

        $pdf->addPage(View::make("print.timesheet")->with(array(
            'timesheet' => $timesheet,
            'user' => $user,
            'unit_type' => $unit_type,
            'rostered_shifts' => $rostered_ordered_shifts,
            'rostered_hours' => round($rostered_hours, 2),
            'submitted_hours' => round($submitted_hours, 2),
            'submitted_days' => round($submitted_days, 2)
        )));

        $pdf->send('Timesheet ' . $end_date->toDateString() . ' - ' . $user->first_name . ' ' . $user->last_name);

        //Display HTML View

        /*return View::make("print.timesheet")->with(array(
            'timesheet'=>$timesheet,
            'user'=>$user,
            'unit_type'=>$unit_type,
            'rostered_shifts'=>$rostered_ordered_shifts,
            'rostered_hours'=>round($rostered_hours,2),
            'submitted_hours'=>round($submitted_hours,2),
            'submitted_days'=>round($submitted_days,2)
        ));*/


    }
}

?>