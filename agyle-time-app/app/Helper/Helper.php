<?php
namespace App\Helper;
use Carbon\Carbon;
define('PRIMARY_CONTACT', 4003);
define('MANAGER', 4002);
define('TEAM_LEADER', 4001);
define('NOT_MANAGEMENT', 4000);

//JSON success values.
//Information (0-499)
define('SUCCESS', 0);
define('DELETE_TASK', 100);
define('CREATE_TASK', 101);
define('UPDATE_TASK', 102);
define('DELETE_SHIFT', 103);
define('CREATE_SHIFT', 104);
define('UPDATE_SHIFT', 105);
define('ROSTER_EXISTED', 401);
define('ROSTER_NOT_YET_RELEASED', 402);
define('TEAM_NOT_FOUND', 410);
define('TEAM_HAS_USER', 300);
define('TEAM_HAS_ROSTER', 400);
//Warning (500-999)
define('DATA_NOT_FOUND', 530);
define('NO_SHIFTS_AVAILABLE', 520);
define('SHIFT_IN_PAST', 540);
//Error (1000-1499)
define('UNAUTHORIZED_ACCESS', 1020);
define('INCORRECT_DATA', 1110);
//Fatal Error (1500-1999)
define('EXCEPTION', 1500);

class Helper
{
    public static function is_debug($param="")
    {
        if($_SERVER['HTTP_HOST']=='beta.agyletime.net' && \Auth::user()->id==159)
            $return=true;
        else
              $return=false;
        if($return==true && str_contains($param,'print'))
        {echo "<span style='color:red;'>$param</red>"; return ""; }else{return $return;}


    }

    public static function managementStatus($string = false)
    {

        if (\Auth::guest()) return $string ? 'Not Management' : NOT_MANAGEMENT;

        if (\Auth::user()->primary_contact == true) {
            return ($string) ? 'Primary Contact' : PRIMARY_CONTACT;
        } else {
            $teams_lead = \Team::where('team_leader_id', '=', \Auth::user()->id)->get();

            $teams_managed = \Team::where('manager_id', '=', \Auth::user()->id)->get();

            if (count($teams_lead) || count($teams_managed)) {
                return ($string) ? 'Manager' : MANAGER;
            } else if (count($teams_lead)) {
                return ($string) ? 'Team Leader' : TEAM_LEADER;
            }
        }

        return ($string) ? 'Not Management' : NOT_MANAGEMENT;
    }



    public static function welcome($email, $first_name)
    {
        $data = array('email' => $email);;

        \Config::set('auth.reminder.email', 'emails.welcome');

        switch ($response = \Password::sendResetLink($data, function ($message) {
            $message->subject('Welcome to Agyle Time!');
        })) {
            case \Password::INVALID_USER:
                return json_encode(array('result' => '401', 'message' => 'invalid user'));

            case \Password::RESET_LINK_SENT:
                return json_encode(array('result' => '0', 'message' => 'success'));
        }
    }

    public static function toArrayKeyId($data)
    {
//        $data_array = $data->toArray(Helper::userTimezone());

        $data_array = $data->toArray(Helper::organisationTimezone());
        $new_array = array();
        foreach ($data_array as $element) {
            if (isset($element['id'])) {
                $new_array[$element['id']] = $element;
            }
        }

        return $new_array;
    }

    /*Takes data and error codes and passes it into the standardised JSON array*/
    public static function jsonLoader($result_code, $data = array(), $dataJson = false)
    {
        switch ($result_code) {
            case SUCCESS:
                $message = "Success";
                break;
            case INCORRECT_DATA:
                $message = "Incorrect data passed to API function.";
                break;
            case UNAUTHORIZED_ACCESS:
                $message = "You are not authorized to view this content.";
                break;
            case TEAM_NOT_FOUND:
                $message = "This team does not contain any members. Please add some via Team Management in order to create a roster.";
                break;
            case DATA_NOT_FOUND:
                $message = "Requested information not found";
                break;
            case NO_SHIFTS_AVAILABLE:
                $message = "No shifts found for this roster combination.";
                break;
            case ROSTER_EXISTED:
                $message = 'Roster existed';
                break;
            case ROSTER_NOT_YET_RELEASED:
                $message = "Roster has not yet been released";
                break;
            case EXCEPTION:
                $message = "Exception";
                break;
            case SHIFT_IN_PAST:
                $message = "Cannot reassign shift in past.";
                break;
            default:
                $message = "Unknown Error";
                break;
        }

        if ($dataJson == true) $data = json_decode($data);

        return \Response::make(json_encode(array('result' => $result_code, 'message' => $message, 'data' => $data)), 200, array('Content-Type' => 'application/json'));

    }

    public static function flattenArray(Array $array)
    {
        $objTmp = (object)array('aFlat' => array());

        array_walk_recursive($array, create_function('&$v, $k, &$t', '$t->aFlat[] = $v;'), $objTmp);

        return $objTmp->aFlat;
    }

    public static function getSubdomain()
    {
        $url = explode('.', $_SERVER['HTTP_HOST']);
        $new_url = [];
        while ($url[0] != "agyletime") //        if($url[0] != "agyletime")
        {
            $new_url[] = array_shift($url);
        }
        $new_url = implode('.', $new_url);
        return $new_url;
    }

    public static function randomString($length = 128)
    {
        $chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";//length:36
        $final_rand = '';
        for ($i = 0; $i < $length; $i++) {
            $final_rand .= $chars[rand(0, strlen($chars) - 1)];

        }
        return $final_rand;
    }

    public static function arraySumIdenticalKeys()
    {
        $arrays = func_get_args();
        $keys = array_keys(array_reduce($arrays, function ($keys, $arr) {
            return $keys + $arr;
        }, array()));
        $sums = array();

        foreach ($keys as $key) {
            $sums[$key] = array_reduce($arrays, function ($sum, $arr) use ($key) {
                return $sum + @$arr[$key];
            });
        }
        return $sums;
    }

    public static function wizardProgress()
    {
        if (Helper::managementStatus() == PRIMARY_CONTACT) {
            return Helper::adminWizard();
        } else {
            return Helper::userWizard();
        }
    }

    private static function userWizard()
    {
        $completed_array = array();

        $completed_array['next_step']['route'] = 'view_roster';
        $completed_array['next_step']['message'] = 'view a roster.';


        $user = \Auth::user();

        if (isset($user->first_name) && isset($user->last_name) && isset($user->phone_one)) {
            $completed_array['user_info'] = true;
            $completed_array['total'] += 20;
        } else {
            $completed_array['user_info'] = false;
            $completed_array['next_step']['route'] = 'user_profile';
            $completed_array['next_step']['message'] = 'edit your information.';
        }


        return $completed_array;
        //if(isset())
    }

    private static function adminWizard()
    {
        $completed_array = array();

        $completed_array['total'] = 0;
        $completed_array['next_step']['route'] = 'view_roster';
        $completed_array['next_step']['message'] = 'view a roster.';

        $user = \Auth::user();
        $organisation = $user->organisation;

        if (count($organisation->team) > 0) {
            if (count($organisation->roster) > 0) {
                $completed_array['rosters'] = true;
                $completed_array['total'] += 20;
            } else {
                $completed_array['rosters'] = false;
                $completed_array['next_step']['route'] = 'edit_roster';
                $completed_array['next_step']['message'] = 'create a roster.';
            }

            $completed_array['teams'] = true;
            $completed_array['total'] += 20;
        } else {
            $completed_array['teams'] = false;
            $completed_array['next_step']['route'] = 'manage_team';
            $completed_array['next_step']['message'] = 'create a team.';
        }

        if (count($organisation->user) > 1) {
            $completed_array['users'] = true;
            $completed_array['total'] += 20;
        } else {
            $completed_array['users'] = false;
            $completed_array['next_step']['route'] = 'manage_team';
            $completed_array['next_step']['message'] = 'add users.';
        }

        if (isset($user->first_name) && isset($user->last_name) && isset($user->phone_one)) {
            $completed_array['user_info'] = true;
            $completed_array['total'] += 20;
        } else {
            $completed_array['user_info'] = false;
            $completed_array['next_step']['route'] = 'user_profile';
            $completed_array['next_step']['message'] = 'edit your information.';
        }

        if (isset($organisation->address) && isset($organisation->phone) && isset($organisation->email)) {
            $completed_array['company_info'] = true;
            $completed_array['total'] += 20;
        } else {
            $completed_array['company_info'] = false;
            $completed_array['next_step']['route'] = 'organisation_profile';
            $completed_array['next_step']['message'] = 'edit your organisation\'s details.';
        }

        return $completed_array;
    }

    public static function hasApp($app_name)
    {
        $app = \Organisation::where('id', '=', \Auth::user()->organisation_id)->whereHas('integration', function ($query) use ($app_name) {
            $query->where('name', '=', $app_name);
        })->first();

        if (isset($app)) {
            return true;
        } else {
            return false;
        }
    }

    public static function isSecure()
    {
        $isSecure = false;
        if (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on') {
            $isSecure = true;
        } elseif (!empty($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] == 'https' || !empty($_SERVER['HTTP_X_FORWARDED_SSL']) && $_SERVER['HTTP_X_FORWARDED_SSL'] == 'on') {
            $isSecure = true;
        }

        return $isSecure;
    }

    public static function timeDiffInSeconds($first, $second)
    {
        return Carbon::parse($first)->diffInSeconds(Carbon::parse($second));
    }

    public static function openingHoursArray($only_open_close = false)
    {
//        $org_availablilities = AvailGeneral::select(DB::raw('min(start_time) as start_time, max(end_time) as end_time'))
        $org_availablilities = \AvailGeneral::select(\DB::raw('start_time, end_time'))
            ->whereHas('orgavailgen', function ($query) {
                $query->where('organisation_id', '=', \Auth::user()->organisation_id);
            })
//            ->first();
            ->get();
        $tmp_start_time = '';
        $tmp_end_time = '';
        $counter = 0;
        foreach($org_availablilities as $avail) {
            $cur_start_time =  new Carbon($avail['start_time'], \Auth::user()->organisation->timezone);
            $cur_end_time = new Carbon($avail['end_time'], \Auth::user()->organisation->timezone);
            if($counter == 0) {
                $tmp_start_time = $cur_start_time;
                $tmp_end_time = $cur_end_time;
            }
            if($cur_start_time->lt($tmp_start_time)) {
                $tmp_start_time = $cur_start_time;

            }
            if($cur_end_time->gt($tmp_end_time)) {
                $tmp_end_time = $cur_end_time;
            }
            $counter ++;
        }
        $start_time = $tmp_start_time;
        $end_time = $tmp_end_time;
        if($start_time == '' || $end_time == '') {
            $mock = array( '1', '2', '3', '4', '5', '6', '7', '8', '9', '10');
            return str_replace('"', "", json_encode($mock));
        } else {
            if ($only_open_close) return ['start_time' => $start_time->toTimeString(), 'end_time' => $end_time->toTimeString()];

            $opening_hours = [];
            $start_time_hour = $start_time->hour;
            $end_time_hour = $end_time->hour;
            for($start_time_hour; $start_time_hour <= $end_time_hour; $start_time_hour++) {
                $opening_hours[] = $start_time_hour;
            }
//        for ($start_time; $start_time->lte($end_time); $start_time->addHour()) {
//            $opening_hours[] = $start_time->hour;
//            $counter++;
//        }
            return str_replace('"', "", json_encode($opening_hours));
        }

    }

    public static function userTimezone()
    {
        if (\Session::get('user_timezone') !== \Auth::user()->timezone) {
            \Session::put('user_timezone', in_array(\Auth::user()->timezone, timezone_identifiers_list()) ? \Auth::user()->timezone : 'UTC');
        }

        return \Session::get('user_timezone');
    }

    public static function organisationTimezone() {
        $timezone = \Auth::user()->organisation->timezone;
        if(isset($timezone)) {
            return $timezone;
        } else {
            self::userTimezone();
        }
    }


}

?>