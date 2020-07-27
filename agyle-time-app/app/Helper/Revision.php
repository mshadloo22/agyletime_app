<?php
/**
 * Created by PhpStorm.
 * User: tli
 * Date: 22/03/2016
 * Time: 2:29 PM
 */

namespace app\Helper;
use Carbon\Carbon;
use App\Helper\Helper;


class Revision
{
    public static function retrieveSchedule($team_id, $start_date, $end_date)
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