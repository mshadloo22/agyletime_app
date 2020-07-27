<?php

define('DEFAULT_ID', 1);
use \App\Models\Roster\User;
use \App\Helper\Helper;
use Carbon\Carbon;

class UserController extends BaseController
{
    public function get_user_profile()
    {
        if (Input::has('id') && Helper::managementStatus() == NOT_MANAGEMENT) return Redirect::route('home')->with('flash_error', 'You are not authorized to view this page.');
        $email = Input::has('id') ? User::find(Input::get('id'))->email : Auth::user()->email;
        $gravatar = "//www.gravatar.com/avatar/" . md5(strtolower(trim($email))) . "?s=113&d=mm";

        return View::make('user_profile')
            ->with('gravatar', $gravatar);
    }

    public function postUser()
    {
        $input = Input::get('data');
        $input = json_decode($input, true);
        $new_user = false;

        if (isset($input['email'], $input['first_name'], $input['last_name'])) {
            if ($input['user_id'] != "") {
                $user = User::find($input['user_id']);
            } else {
                $user = User::where('email', '=', $input['email'])->where('organisation_id', '=', Auth::user()->organisation_id)->first();

                if (!isset($user)) {
                    $user = new User;

                    $new_user = true;

                    $user->organisation_id = Auth::user()->organisation_id;
                    $user->notification_preference_id = DEFAULT_ID;
                    $user->message_notification_id = DEFAULT_ID;
                    $user->password = Hash::make('changethispassword');
                    $user->timezone = DEFAULT_ID;
                    $user->active = true;
                    $user->tour_state = 'finished'; //Turn off tour temporarily
                    $user->team_id = $input['team_id'];

                }
            }

            $user = $this->updateUser($input, $user);

            if ($new_user) Helper::welcome($user->email, $user->first_name);

            return Helper::jsonLoader(SUCCESS, array('id' => $user->id));
        } else {
            return Helper::jsonLoader(INCORRECT_DATA);
        }
    }

    public function getUser()
    {
        $user_id = Input::has('user_id') ? Input::get('user_id') : Auth::user()->id;
        $user = User::where(function ($query) use ($user_id) {
            $query->where('id', '=', $user_id)
                ->where('organisation_id', '=', Auth::user()->organisation_id);
        })
            ->with(array(
                'city',
                'availgeneral',
                'role',
                'payrate' => function ($query) {
                    $query->where('user_pay_rate.end_date', '=', null);
                },
                'billablerate' => function ($query) {
                    $query->where('user_billable_rate.end_date', '=', null);
                }
            ))
            ->first();

        return isset($user) ? Helper::jsonLoader(SUCCESS, $user->toArray()) : Helper::jsonLoader(INCORRECT_DATA);
    }

    public function getUsers()
    {
        $users = User::where(function ($query) {
            $query->where('organisation_id', '=', Auth::user()->organisation_id);
            if (Input::has('team_id')) $query->where('team_id', '=', Input::get('team_id'));
            if (!Input::has('with_inactive')) $query->where('active', '=', true);
        })
            ->with('city')
            ->with(array('payrate' => function ($query) {
                $query->where('user_pay_rate.end_date', '=', null);
            }))
            ->with(array('billablerate' => function ($query) {
                $query->where('user_billable_rate.end_date', '=', null);
            }))
            ->get();

        return isset($users) ? Helper::jsonLoader(SUCCESS, $users->toArray()) : Helper::jsonLoader(INCORRECT_DATA);
    }


    public function postDeactivateUser()
    {
        if (Input::has('user_id')) {
            $user = User::where('id', '=', Input::get('user_id'))->first();
            if (isset($user)) {
                $user->active = false;
                $user->save();
                return Helper::jsonLoader(SUCCESS);
            } else {
                return Helper::jsonLoader(INCORRECT_DATA);
            }
        } else {
            return Helper::jsonLoader(DATA_NOT_FOUND);
        }
    }

    public function postActivateUser()
    {
        if (Input::has('user_id')) {
            $user = User::where('id', '=', Input::get('user_id'))->first();
            if (isset($user)) {
                $user->active = true;
                $user->save();
                return Helper::jsonLoader(SUCCESS);
            } else {
                return Helper::jsonLoader(INCORRECT_DATA);
            }
        } else {
            return Helper::jsonLoader(DATA_NOT_FOUND);
        }
    }

    public function postCreateFromCSV()
    {
        if (Input::hasFile('csv')) {
            $csv = new Keboola\Csv\CsvFile(Input::file('csv'));
            $array_check = array('email', 'team_name', 'first_name', 'last_name', 'phone_one', 'phone_two', 'gender', 'pay_rate', 'address', 'city', 'post_code', 'softphone_id', 'site_id');
            $header = $csv->getHeader();

            if ($array_check == $header) {
                foreach ($csv as $row) {

                    if ($csv->key() != 0) {
                        $input = array('email' => $row[0], 'team_name' => $row[1], 'first_name' => $row[2], 'last_name' => $row[3], 'phone_one' => $row[4], 'phone_two' => $row[5], 'gender' => $row[6], 'pay_rate' => $row[7], 'address' => $row[8], 'city' => $row[9], 'post_code' => $row[10], 'softphone_id' => $row[11], 'site_id' => $row[12]);

                        if (isset($input['email'], $input['first_name'], $input['last_name'])) {
                            $user = User::where('email', '=', $input['email'])->where('organisation_id', '=', Auth::user()->organisation_id)->first();

                            if (!isset($user)) {
                                $user = new User;

                                $user->organisation_id = Auth::user()->organisation_id;
                                $user->notification_preference_id = DEFAULT_ID;
                                $user->message_notification_id = DEFAULT_ID;
                                $user->password = Hash::make('changethispassword');
                                $user->timezone = DEFAULT_ID;
                                $user->tour_state = 'finished'; //Turn off tour temporarily
                                $user->active = true;
                            }

                            $user = $this->updateUser($input, $user);

                            Helper::welcome($user->email, $user->first_name);
                        }
                    }
                }

            }
            return Redirect::route('organisation_profile')
                ->with('flash_success', 'Users Added.');
        }
    }

    public function getDeactivatedUsers()
    {
        $users = User::where('organisation_id', '=', Auth::user()->organisation_id)->where('active', '=', false)->get();

        return Helper::jsonLoader(SUCCESS, array('users' => $users->toArray()));
    }

    private function updateUser($input, User $user)
    {
        if ($input['first_name'] != "")
            $user->first_name = $input['first_name'];

        if ($input['last_name'] != "")
            $user->last_name = $input['last_name'];

        if ($input['email'] != "")
            $user->email = $input['email'];

        if ($input['phone_one'] != "")
            $user->phone_one = $input['phone_one'];

        if ($input['phone_two'] != "")
            $user->phone_two = $input['phone_two'];

        if ($input['gender'] != "")
            $user->gender = $input['gender'];


        if ($input['address'] != "")
            $user->address = $input['address'];

        if ($input['post_code'] != "")
            $user->post_code = $input['post_code'];
        if (isset($input['timezone']) && $input['timezone'] != "") {
            $user->timezone = $input['timezone'];
        }

        if (isset($input['employment_rules_template']) && $input['employment_rules_template'] != "")
            $user->employment_rules_template_id = $input['employment_rules_template'];

        $user->site_id = isset($input['site_id']) ?
            $input['site_id'] : Site::whereOrganisationId(Auth::user()->organisation_id)->first()->id;

        if (isset($input['team_name']) && $input['team_name'] != "") {
            $team = Team::where('name', '=', $input['team_name'])->where('organisation_id', '=', Auth::user()->organisation_id)->first();
            if (isset($team)) $user->team_id = $team->id;
        }
        if (isset($input['team_id'])) {
            $user->team_id = $input['team_id'];
        }
        if (isset($input['primary_contact'])) {
            $user->primary_contact = $input['primary_contact'];
        }

        $city = City::where('city_name', '=', $input['city'])->first();

        if (isset($city)) {
            $user->city_id = $city->id;
        } else if ($input['city'] != "") {
            $city = new City;
            $city->city_name = $input['city'];
            $city->country_name = 'Australia';
            $city->save();

            $user->city_id = $city->id;
        }

        $user->save();

//        if (count($input['roles'] > 0))
//            $user->role()->sync($input['roles']);
//
//        if (isset($input['softphone_id']))
//        {
//            $user->integration()->sync(array(2 => array('configuration' => json_encode(array("EmployeeAlias" => $input['softphone_id'])))));
//        }
//
//        if (isset($input['cti_id']))
//        {
//            $user->integration()->sync(array(3 => array('configuration' => json_encode(array("EmployeeAlias" => $user->id)))));
//        }

        $this->updatePayRate($user, isset($input['pay_rate']) ? $input['pay_rate'] : 0, isset($input['unit_type']) ? $input['unit_type'] : 'hour');
        $this->updateBillableRate($user, isset($input['billable_rate']) ? $input['billable_rate'] : 0, isset($input['unit_type']) ? $input['unit_type'] : 'hour');

        return $user;
    }


    public function getUserManagementStatus()
    {
        return Helper::jsonLoader(SUCCESS, array('management_status' => Helper::managementStatus(true)));
    }

    public function get_dashboard()
    {
        switch (Helper::managementStatus()) {
            case NOT_MANAGEMENT:
                return $this->user_dashboard();
            default:
                return $this->user_dashboard();
        }
    }

    private function user_dashboard()
    {
        $start_date = new Carbon(Helper::organisationTimezone());
        $start_date->subMonths(2);
        $end_date = new Carbon(Helper::organisationTimezone());

        $timesheets = Timesheet::where('date_end', '<=', $end_date->toDateString())
            ->where('date_end', '>=', $start_date->toDateString())
            ->where('user_id', '=', Auth::user()->id)
            ->orderBy('approval_stage', 'asc')
            ->orderBy('date_start', 'desc')
            ->limit(10)
            ->get(array('id', 'date_end', 'approval_stage', 'notes'));

        $leave_requests = AvailSpecific::where('end_date', '>=', $end_date->toDateString())
            ->whereHas('user', function ($query) {
                $query->where('id', '=', Auth::user()->id);
            })
            ->with(array('user' => function ($query) {
                $query->where('id', '=', Auth::user()->id);
            }))->get();

        $start_date->addMonths(2);
        $start_date->startOfWeek();
        $end_date->addWeek();
        $end_date->endOfWeek();

        $rosters = Roster::where('date_start', '>=', $start_date->toDateString())
            ->where('date_ending', '<=', $end_date->toDateString())
            ->where('roster_stage', '=', 'released')
            ->where('team_id', '=', Auth::user()->team_id)
            ->with(array('rosteredshift' => function ($query) {
                $query->where('user_id', '=', Auth::user()->id);
            }))
            ->orderBy('date_start', 'desc')
            ->get();

        $this_week_shifts = $this->generateShiftArray($start_date->copy(), $rosters);
        $next_week_shifts = $this->generateShiftArray($start_date->copy()->addWeek(), $rosters);

        return View::make('user_dashboard')
            ->with('timesheets', $timesheets->toArray())
            ->with('this_week_shifts', $this_week_shifts)
            ->with('next_week_shifts', $next_week_shifts)
            ->with('leave_requests', $leave_requests);
    }

    private function management_dashboard()
    {

    }

    private function administrator_dashboard()
    {

    }

    private function generateRosterArray($start_date, $rosters)
    {
        $rosters_array = [];
        $date_array = [];

        for ($i = 0; $i < 7; $i++) {
            $date = $start_date->copy()->addDays($i);
        }

        foreach ($rosters as $roster) {
            $roster_element = [];
            $roster_element['team_name'] = $roster->team->name;
            $roster_element['team_id'] = $roster->team->id;
            $roster_element['start_date'] = $start_date;
        }
    }

    private function generateShiftArray(Carbon $start_date, $rosters)
    {
        $week_shifts = [];
        $roster_id = null;

        for ($i = 0; $i < 7; $i++) {
            $date = $start_date->copy()->addDays($i);
            $temp_shift = null;
            foreach ($rosters as $roster) {
                if ($roster->date_start->toDateString() == $date->toDateString()) {
                    $roster_id = $roster->id;
                }
                foreach ($roster->rosteredshift as $shift) {
                    if ($date->toDateString() == $shift->date->toDateString()) {
                        $temp_shift = $shift;
                    }
                }
            }
            $week_shifts[$i] = [
                $date,
                $temp_shift
            ];
        }

        return array('roster_id' => $roster_id, 'shifts' => $week_shifts);
    }

    public function postGeneralAvailabilities()
    {
        $input = Input::all();
        $user = isset($input['user_id']) ?
            User::find($input['user_id']) :
            Auth::user();
        $input = json_decode($input['availabilities'], true);

        foreach ($input as $weekday) {

            if ($weekday['start_time'] != "" && $weekday['end_time'] != "") {
                $start_time = explode(':', $weekday['start_time']);
                $start_time = Carbon::createFromTime($start_time[0], $start_time[1], 0, Helper::organisationTimezone());

                $end_time = explode(':', $weekday['end_time']);
                $end_time = Carbon::createFromTime($end_time[0], $end_time[1], 0, Helper::organisationTimezone());

                if ($start_time->diffInMinutes($end_time) > 0) {
                    $avail_table = AvailGeneral::where('start_time', '=', $start_time->copy()->timezone(Config::get('app.timezone'))->toTimeString())
                        ->where('end_time', '=', $end_time->copy()->timezone(Config::get('app.timezone'))->toTimeString())
                        ->where('day', '=', $weekday['weekday'])
                        ->first();

                    if (isset($avail_table)) {
                        $old_avail_table = $user->availgeneral()->where('avail_general.day', '=', $weekday['weekday'])->first();
                        if (isset($old_avail_table)) {
                            User::find($user->id)->availgeneral()->detach($old_avail_table->id);
                        }
                        $user->availgeneral()->attach($avail_table->id);
                    } else {
                        $avail_table = $user->availgeneral()->where('avail_general.day', '=', $weekday['weekday'])->first();
                        if (isset($avail_table)) {
                            User::find($user->id)->availgeneral()->detach($avail_table->id);
                        }
                        $avail_table = new AvailGeneral;
                        $avail_table->day = $weekday['weekday'];
                        $avail_table->start_time = $start_time->toTimeString();
                        $avail_table->end_time = $end_time->toTimeString();
                        $avail_table->save();

                        $user->availgeneral()->attach($avail_table->id);
                    }
                }
            } else if ($weekday['start_time'] == "" && $weekday['end_time'] == "") {
                $avail_table = $user->availgeneral()->where('avail_general.day', '=', $weekday['weekday'])->first();
                if (isset($avail_table)) {
                    User::find($user->id)->availgeneral()->detach($avail_table->id);
                }
            } else {
                return Helper::jsonLoader(INCORRECT_DATA);
            }
        }

        return Helper::jsonLoader(SUCCESS);
    }

    private function updatePayRate(User $user, $new_pay_rate, $unit_type = 'hour')
    {
        $old_rate = PayRate::whereHas('user', function ($query) use ($user) {
            $query->where('user.id', '=', $user->id)
                ->where('user_pay_rate.end_date', '=', null);
        })->with(array('user' => function ($query) use ($user) {
            $query->where('user.id', '=', $user->id)
                ->where('user_pay_rate.end_date', '=', null);
        }))->first();

        if ((isset($old_rate) && ($old_rate->pay_rate != $new_pay_rate || $old_rate->unit_type != $unit_type)) || (!isset($old_rate) && $new_pay_rate != '')) {
            if (isset($old_rate)) {
                PayRate::find($old_rate->id)->user()->updateExistingPivot($old_rate->user[0]->id, ['end_date' => new Carbon(Helper::organisationTimezone())]);
            }

            if ($new_pay_rate != '') {
                $new_pay_rate = str_replace('$', '', $new_pay_rate);
                $new_rate = PayRate::firstOrCreate(array('pay_rate' => $new_pay_rate, 'unit_type' => $unit_type));
                $user->payrate()->attach($new_rate->id, array('start_date' => Carbon::now()->toDateString()));

                return true;
            }
        }
        return false;
    }

    private function updateBillableRate(User $user, $new_billable_rate, $unit_type = 'hour')
    {
        $old_rate = BillableRate::whereHas('user', function ($query) use ($user) {
            $query->where('user.id', '=', $user->id)
                ->where('user_billable_rate.end_date', '=', null);
        })->with(array('user' => function ($query) use ($user) {
            $query->where('user.id', '=', $user->id)
                ->where('user_billable_rate.end_date', '=', null);
        }))->first();

        if ((isset($old_rate) && ($old_rate->billable_rate != $new_billable_rate || $old_rate->unit_type != $unit_type)) || (!isset($old_rate) && $new_billable_rate != '')) {
            if (isset($old_rate)) {
                BillableRate::find($old_rate->id)->user()->updateExistingPivot($old_rate->user[0]->id, ['end_date' => new Carbon(Helper::organisationTimezone())]);
            }

            if ($new_billable_rate != '') {
                $new_billable_rate = str_replace('$', '', $new_billable_rate);
                $new_rate = BillableRate::firstOrCreate(array('billable_rate' => $new_billable_rate, 'unit_type' => $unit_type));
                $user->billablerate()->attach($new_rate->id, array('start_date' => Carbon::now()->toDateString()));

                return true;
            }
        }
        return false;
    }

}