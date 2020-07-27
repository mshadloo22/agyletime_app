<?php
use \App\Helper\Helper;
use \App\Helper\Revision as RevisionHelper;
use \App\Models\Roster\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use \App\Events\PublishedScheduleHasBeenUpdated;

class RosterController extends BaseController
{

    /*
     * Controller for the edit_roster route.
     * Passes all of the teams attached to the user's organisation into the View.
    */
    public function edit_roster()
    {
        return View::make('edit_roster')
            ->with('team_id', Auth::user()->team_id);
    }

    public function view_roster()
    {
        if(Helper::is_debug())
            echo 'im a debuger';


        return View::make('view_roster')
            ->with('management', Helper::managementStatus())
            ->with('team_id', Auth::user()->team_id);
    }

    public function roster_from_schedule()
    {
        return View::make('roster_from_schedule')
            ->with('opening_hours', Helper::openingHoursArray());
    }

    /* Only take a old_team_id a new_team_id as input to update rosters' team_id */
    public function updateRosterTeamAjax() {
        if (Input::has('old_team_id', 'selected_team_id')) {
            $old_team_id = Input::get('old_team_id');
            $selected_team_id = Input::get('selected_team_id');
        } else {
            return Helper::jsonLoader(INCORRECT_DATA);
        }
        $rosters = Roster::where('team_id', '=', $old_team_id)->get();
        try {
            foreach($rosters as $roster) {
                $roster->team_id = $selected_team_id;
                $roster->save();
            }
        } catch (Exception $e) {
            return Helper::jsonLoader(INCORRECT_DATA);
        }
        return Helper::jsonLoader(SUCCESS);
    }

    /*Designed to take a team_id and a date (as yyyy-mm-dd) and pass back the appropriate roster including all shifts*/
    public function getRoster()
    {
        //get the team_id and date, make sure they exist.
        if (Input::has('team_id', 'date')) {
            $team_id = Input::get('team_id');
            $date = Input::get('date');
        } else {
            return Helper::jsonLoader(INCORRECT_DATA);
        }
        //Get the start and end dates of the roster, uses the ExpressiveDate plugin.
        try {
            $end_date = Carbon::parse($date, Helper::organisationTimezone())->endOfWeek();
            $start_date = Carbon::parse($date, Helper::organisationTimezone())->startOfWeek();
        } catch (Exception $e) {
            return Helper::jsonLoader(INCORRECT_DATA);
        }


        //Obtain the  roster and shift information.
        $roster = Roster::where('date_ending', '=', $end_date->toDateString())->where('team_id', '=', $team_id)->first();
        $shifts = User::where('user.team_id', '=', $team_id)
            ->where('user.active', '=', true)
            ->leftJoin('rostered_shift', 'user.id', '=', 'rostered_shift.user_id')
            ->where('rostered_shift.date', '<=', $end_date->toDateString())
            ->where('rostered_shift.date', '>=', $start_date->toDateString())
            ->select(array('user.id', 'rostered_shift.*'))
            ->orderBy('user.email')
            ->get();

        foreach ($shifts as $key => $shift) {
            if ($shift->created_at !== '0000-00-00 00:00:00')
                $shifts[$key]->created_at = Carbon::parse($shift->created_at)->toDateTimeString();
            if ($shift->updated_at !== '0000-00-00 00:00:00')
                $shifts[$key]->updated_at = Carbon::parse($shift->updated_at)->toDateTimeString();
            if ($shift->rostered_start_time !== '0000-00-00 00:00:00') {
                $temp = Carbon::parse($shift->rostered_start_time)->timezone(Helper::organisationTimezone())->toDateTimeString();
                $shifts[$key]->rostered_start_time = $temp;
            }
            if ($shift->rostered_end_time !== '0000-00-00 00:00:00') {
                $temp = Carbon::parse($shift->rostered_end_time)->timezone(Helper::organisationTimezone())->toDateTimeString();
                $shifts[$key]->rostered_end_time = $temp;
            }
        }

        if (($management_status = Helper::managementStatus()) == NOT_MANAGEMENT) {
            $users = User::where('user.team_id', '=', $team_id)
                ->where('user.active', '=', true)
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
                ->with('availgeneral')
                ->orderBy('first_name', 'asc')
                ->get(array('id', 'email', 'first_name', 'last_name'));
        } else {
            $users = User::where('user.team_id', '=', $team_id)
                ->where('user.active', '=', true)
                ->with(array('payrate' => function ($query) {
                    $query->where('user_pay_rate.end_date', '=', null);
                }))
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
                ->with('availgeneral')
                ->orderBy('first_name', 'asc')
                ->get(array('id', 'email', 'first_name', 'last_name'));
        }


        /* Checks to make sure both the roster and shifts were found successfully.
         * Because it grabs the shifts through users, shifts will only be empty if there are no users in the team.
         */

        if (count($users) > 0) {
            $data = array_merge(array('team_members' => Helper::toArrayKeyId($users)));
            if (!isset($roster)) {
                $roster = new Roster;
                $roster->team_id = $team_id;
                $roster->date_start = $start_date->toDateString();
                $roster->date_ending = $end_date->toDateString();
                $roster->roster_stage = 'pending';
                $roster->save();
            }
            $data['roster'] = $roster->toArray();
            if ($management_status != NOT_MANAGEMENT || $roster->roster_stage == 'released') {
                $data['shifts'] = Helper::toArrayKeyId($shifts);
            } else {
                $data['shifts'] = array();
            }
            $data['is_management'] = ($management_status == NOT_MANAGEMENT) ? false : true;
            $data['organisation_open_hours'] = Auth::user()->organisation->availgeneral->toArray();
            return Helper::jsonLoader(SUCCESS, $data);
        } else {
            return Helper::jsonLoader(TEAM_NOT_FOUND);
        }
    }

    public function clone_roster()
    {
        $input = Input::get('data');
        $input = json_decode($input, true);
        if (isset($input['roster']) && isset($input['team_members'])) {
            $ref_roster = Roster::find($input['roster']['id']);
            $new_date_start = $ref_roster->date_start->addDays(7);
            $new_date_ending = $ref_roster->date_ending->addDays(7);
            $team_members = $input['team_members'];
            $rosterList = DB::table('roster')
                ->where('date_start', $new_date_start)
                ->where('date_ending', $new_date_ending)
                ->where('team_id', $ref_roster->team_id)
                ->get();
            if (count($rosterList) > 0) {
                if (isset($input['is_confirmed_overwrite']) && $input['is_confirmed_overwrite'] == true) {
                    $roster = $rosterList[0];
                    //remove all the existed shifts as clients asked for over-ride
                    DB::table('rostered_shift')
                        ->where('rostered_start_time', '>=' ,$new_date_start)
                        ->where('rostered_end_time', '<=', $new_date_ending)
                        ->where('roster_id', $rosterList[0]->id)
                        ->delete();
                } else {
                    //check if this roster has existed shifts
                    $shiftList = DB::table('rostered_shift')
                        ->where('rostered_start_time', '>=' ,$new_date_start)
                        ->where('rostered_end_time', '<=', $new_date_ending)
                        ->where('roster_id', $rosterList[0]->id)
                        ->get();
                    if (count($shiftList) > 0) {
                        return Helper::jsonLoader(ROSTER_EXISTED);
                    } else { //This is an empty roster
                        $roster = $rosterList[0];
                    }
                }
            } else {
                $roster = new Roster();
                //save the new roster for next week
                $roster->team_id = $ref_roster->team_id;
                $roster->date_start = $new_date_start;
                $roster->date_ending = $new_date_ending;
                $roster->roster_stage = 'pending';
                $roster->save();
            }
            foreach ($team_members as $member) {
                foreach ($member['shifts'] as $shift) {
                    if ($shift != NULL) {
                        $shift_model = new RosteredShift;
                        $shift_model->roster_id = $roster->id;
                        $shift_model->user_id = $member['user_id'];
                        $shift_model->date = (new Carbon($shift['date']))->addDays(7);
                        $temp_start = (new Carbon($shift['rostered_start_time'], Helper::organisationTimezone()))->addDays(7)->timezone('UTC');
                        $temp_end = (new Carbon($shift['rostered_end_time'], Helper::organisationTimezone()))->addDays(7)->timezone('UTC');
                        $shift_model->rostered_start_time = $temp_start;
                        $shift_model->rostered_end_time = $temp_end;
                        $shift_model->notes = $shift['notes'];
                        $shift_model->save();
                    }
                }
            }

            return Helper::jsonLoader(SUCCESS);

        } else {
            return Helper::jsonLoader(INCORRECT_DATA);
        }

    }

    public function postRoster()
    {
        $input = Input::get('data');
        $input = json_decode($input, true);
        if (isset($input['roster'])) {
            $date_start = $input['roster']['date_start'];
            $date_end = $input['roster']['date_ending'];
            $team_id = $input['selected_team']['team_id'];
            $input_for_revision = RevisionHelper::retrieveSchedule($team_id, $date_start, $date_end);
            $team_members = $input['team_members'];
            $roster = Roster::find($input['roster']['id']);

            if ($roster->roster_stage != $input['roster']['roster_stage']) {
                $roster->roster_stage = $input['roster']['roster_stage'];
                $roster->save();

                if ($roster->roster_stage == 'released') {
                    $data = array('date' => $roster->date_ending, 'team_id' => $roster->team_id);

                    foreach ($team_members as $member) {
                        Mail::send('emails.roster_released', $data, function ($message) use ($member, $roster) {
                            $message->to($member['email'], $member['first_name'] . " " . $member['last_name'])
                                ->subject("Roster Released for Week Ending: " . Carbon::parse($roster->date_ending, Helper::organisationTimezone())->toFormattedDateString());
                        });
                    }
                }
            }
            foreach ($team_members as $member) {
                foreach ($member['shifts'] as $shift) {
                    if ($shift != NULL) {
                        if (isset($shift['destroy'])) {
                            ShiftTask::where('rostered_shift_id', '=', $shift['shift_id'])->delete();
                            RosteredShift::destroy($shift['shift_id']);
                        } else {
                            if ($shift['shift_id'] != '') {
                                $shift_model = RosteredShift::find($shift['shift_id']);
                            } else {
                                $shift_model = new RosteredShift;
                                $shift_model->roster_id = $input['roster']['id'];
                                $shift_model->user_id = $member['user_id'];
                                $shift_model->date = $shift['date'];
                            }
                            $tmp_start_time = new Carbon($shift['rostered_start_time'], Helper::organisationTimezone());
                            $tmp_end_time = new Carbon($shift['rostered_end_time'], Helper::organisationTimezone());
                            $tmp_start_time->tz('UTC');
                            $tmp_end_time->tz('UTC');
                            $shift_model->rostered_start_time = $tmp_start_time;
                            $shift_model->rostered_end_time = $tmp_end_time;
                            $shift_model->notes = $shift['notes'];
                            $shift_model->save();
                        }
                    }
                }
            }
            Event::fire(new PublishedScheduleHasBeenUpdated($input_for_revision, $date_start, $date_end));

            return Helper::jsonLoader(SUCCESS);
        }
        return Helper::jsonLoader(INCORRECT_DATA);
    }

    public function getUserShifts()
    {
        $user_id = Input::has('user_id') ? Input::get('user_id') : Auth::user()->id;
        if (Input::has('date')) {
            try {
                $date = new Carbon(Input::get('date'), Helper::organisationTimezone());
            } catch (Exception $e) {
                return Helper::jsonLoader(INCORRECT_DATA);
            }
        } else {
            return Helper::jsonLoader(INCORRECT_DATA);
        }
        $start_date = $date->copy()->startofWeek();
        $end_date = $date->copy()->endOfWeek();

        $shifts = RosteredShift::where('user_id', '=', $user_id)
            ->whereBetween('date', array($start_date->toDateString(), $end_date->toDateString()))
            ->with('shiftdata')
            ->with(array('shifttask' => function ($query) {
                $query->with('task')
                    ->with('taskdata');
            }))
            ->get();

        return Helper::jsonLoader(SUCCESS, array('shifts' => $shifts->toArray()));
    }

    public function getAvailableUsersByRole()
    {
        if (!Input::has('role_id', 'date')) return Helper::jsonLoader(INCORRECT_DATA);

        $role_id = Input::get('role_id');
        $date = new Carbon(Input::get('date'));

        $users = User::whereHas('Role', function ($query) use ($role_id) {
            $query->whereRoleId($role_id);
        })
            ->whereActive(true)
            ->with(array(
                'team',
                'rosteredshift' => function ($query) use ($date) {
                    $query->where('date','=',$date->toDateString())
                        ->with('scheduledshift');
                },
                'availgeneral' => function ($query) use ($date) {
                    $query->where('day', '=', $date->format("l"));
                },
                'availspecific' => function ($query) use ($date) {
                    $query->withinLeave($date)
                        ->where('user_avail_spec.authorized', '=', 'approved');
                }))
            ->get();

        return Helper::jsonLoader(SUCCESS, $users->toArray());
    }

    public function postRosterFromSchedule()
    {
        if (!Input::has('rows', 'date')) return Helper::jsonLoader(INCORRECT_DATA);

        $rows = Input::get('rows')['rows'];
        $date = new Carbon(Input::get('date'));

        //if($date->isPast()) return Helper::jsonLoader(SHIFT_IN_PAST);

        foreach ($rows as $row) {
            $shift = $row['tasks'][0];

            if (!isset($shift['data']['selected_user'])) continue;

            $this->rosteredShiftFromScheduled($shift, $date, $shift['data']['selected_user']);
        }

        return Helper::jsonLoader(SUCCESS);
    }

    private function rosteredShiftFromScheduled($scheduled_shift, $date, $new_user = null)
    {
        $shift_model = ScheduledShift::whereId($scheduled_shift['data']['db_id'])
            ->with(array('rosteredshift', 'shifttask'))
            ->first();

        if ($new_user === null || empty($new_user))
            return $this->clearShift($shift_model);

        if (isset($shift_model->rosteredshift) && $new_user['id'] != $shift_model->rosteredshift->user_id)
            $shift_model = $this->clearShift($shift_model);

        $roster = Roster::firstOrNew(array(
            'team_id' => $scheduled_shift['data']['selected_user']['team_id'],
            'date_start' => $date->copy()->endOfWeek()->toDateString(),
            'date_ending' => $date->copy()->startOfWeek()->toDateString()
        ));

        if (!$roster->exists) {
            $roster->roster_stage = 'pending';
            $roster->save();
        }

        if (!isset($shift_model->rosteredshift)) {
            $rostered_shift = RosteredShift::create(array(
                'date' => $shift_model->date,
                'rostered_start_time' => $shift_model->start_time,
                'rostered_end_time' => $shift_model->end_time,
                'user_id' => $new_user['id'],
                'roster_id' => $roster->id
            ));
            if (count($shift_model->shifttask) > 0)
                ShiftTask::whereIn('id', $shift_model->shifttask()->lists('id'))
                    ->update(array('rostered_shift_id' => $rostered_shift->id));

            $shift_model->rosteredshift()->associate($rostered_shift);
            $shift_model->save();

        }

        return $shift_model;
    }

    private function clearShift($shift)
    {
        if (isset($shift->rosteredshift)) {
            if (count($shift->shifttask) > 0)
                ShiftTask::whereIn('id', $shift->shifttask()->lists('id'))
                    ->update(array('rostered_shift_id' => null));

            $rostered_shift_id = $shift->rosteredshift->id;
            $shift->rostered_shift_id = null;
            $shift->save();
            RosteredShift::destroy($rostered_shift_id);
        }
        return $shift;
    }
}

?>