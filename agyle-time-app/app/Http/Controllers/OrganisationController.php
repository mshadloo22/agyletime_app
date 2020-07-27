<?php
use \App\Helper\Helper;

use Carbon\Carbon;
class OrganisationController extends BaseController
{
    public function organisation_profile()
    {
        return View::make('organisation_profile')
                   ->with('weekdays', array('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'));
    }

    public function getOrganisationProfile()
    {
        $organisation_profile = Auth::user()->organisation;
        $organisation_profile -> city = City::find(Auth::user()->organisation->city_id);
        return Helper::jsonLoader(SUCCESS, $organisation_profile->toArray());
    }

    public function getMaxOpeningHours()
    {
        return Helper::jsonLoader(SUCCESS, Helper::openingHoursArray(true));
    }

    public function postOrganisationProfile()
    {
        $input = Input::all();
        $organisation = Auth::user()->organisation;

        $input = json_decode($input['data'], true);

        $organisation->name = $input['name'];
        $organisation->email = $input['email'];
        $organisation->phone = $input['phone'];
        $organisation->address = $input['address'];
        $organisation->post_code = $input['post_code'];
        $organisation->timezone = $input['timezone'];

        $city = City::where('city_name', '=', $input['city'])->first();

        if (isset($city))
        {
            $organisation->city_id = $city->id;
        } else
        {
            $city = new City;
            $city->city_name = $input['city'];
            $city->country_name = 'Australia';
            $city->save();

            $organisation->city_id = $city->id;
        }

        $organisation->save();

        return Helper::jsonLoader(SUCCESS);
    }

    public function getOrganisationOpeningHours()
    {
        $availabilities_general = Auth::user()->organisation->availgeneral;

        return Helper::jsonLoader(SUCCESS, $availabilities_general->toArray());
    }

    public function postOrganisationOpeningHours()
    {
        $input = Input::all();
        $organisation = Auth::user()->organisation;
        $input = json_decode($input['data'], true);

        if (isset($input['opening_hours']))
        {
            $input = $input['opening_hours'];
        } else
        {
            return Helper::jsonLoader(INCORRECT_DATA);
        }

        foreach ($input as $weekday)
        {

            if ($weekday['open_time'] != "" && $weekday['close_time'] != "")
            {
                $start_time = explode(':', $weekday['open_time']);
                $start_time = Carbon::createFromTime($start_time[0], $start_time[1], 0, Helper::organisationTimezone());

                $end_time = explode(':', $weekday['close_time']);
                $end_time = Carbon::createFromTime($end_time[0], $end_time[1], 0, Helper::organisationTimezone());

                if ($start_time->diffInMinutes($end_time) > 0)
                {
                    $avail_table = AvailGeneral::where('start_time', '=', $start_time->copy()->timezone(Config::get('app.timezone'))->toTimeString())
                                               ->where('end_time', '=', $end_time->copy()->timezone(Config::get('app.timezone'))->toTimeString())
                                               ->where('day', '=', $weekday['weekday'])
                                               ->first();

                    if (isset($avail_table))
                    {
                        $old_avail_table = $organisation->availgeneral()->where('avail_general.day', '=', $weekday['weekday'])->first();
                        if (isset($old_avail_table))
                        {
                            Organisation::find($organisation->id)->availgeneral()->detach($old_avail_table->id);
                        }
                        $organisation->availgeneral()->attach($avail_table->id);
                    } else
                    {

                        $avail_table = $organisation->availgeneral()->where('avail_general.day', '=', $weekday['weekday'])->first();
                        if (isset($avail_table))
                        {
                            Organisation::find($organisation->id)->availgeneral()->detach($avail_table->id);
                        }
                        $avail_table = new AvailGeneral;
                        $avail_table->day = $weekday['weekday'];
                        $avail_table->start_time = $start_time->toTimeString();
                        $avail_table->end_time = $end_time->toTimeString();
                        $avail_table->save();

                        $organisation->availgeneral()->attach($avail_table->id);
                    }
                }
            } else if ($weekday['open_time'] == "" && $weekday['close_time'] == "")
            {
                $avail_table = $organisation->availgeneral()->where('avail_general.day', '=', $weekday['weekday'])->first();
                if (isset($avail_table))
                {
                    Organisation::find($organisation->id)->availgeneral()->detach($avail_table->id);
                }
            } else
            {
                return Helper::jsonLoader(INCORRECT_DATA);
            }
        }

        return Helper::jsonLoader(SUCCESS);
    }

    public function setup_wizard()
    {
        return View::make('setup_wizard');
    }

    public function complete_setup_wizard()
    {
        $wizard_progress = Helper::wizardProgress();
        $complete = true;

        $string = 'Your company is not set up, please perform the following steps: ';

        if (!$wizard_progress['company_info'])
        {
            if ($complete == false)
            {
                $string .= ", complete company profile";
            } else
            {
                $string .= "complete company profile";
                $complete = false;
            }
        }
        if (!$wizard_progress['user_info'])
        {
            if ($complete == false)
            {
                $string .= ", complete your personal profile";
            } else
            {
                $string .= "complete your personal profile";
                $complete = false;
            }
        }
        if (!$wizard_progress['teams'])
        {
            if ($complete == false)
            {
                $string .= ", add a team";
            } else
            {
                $string .= "add a team";
                $complete = false;
            }
        }
        if (!$wizard_progress['users'])
        {
            if ($complete == false)
            {
                $string .= ", add an employee";
            } else
            {
                $string .= "add an employee";
                $complete = false;
            }
        }

        $string .= ".";
        if ($complete == true)
        {
            $organisation = Auth::user()->organisation;
            $organisation->setup_wizard_complete = true;
            $organisation->save();

            return Redirect::route('home')
                           ->with('flash_notice', 'Company profile is setup.');
        } else
        {
            return Redirect::route('setup_wizard')
                           ->with('flash_error', $string);
        }
    }

}

?>