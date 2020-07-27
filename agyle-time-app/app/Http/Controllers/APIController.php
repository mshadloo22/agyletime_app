<?php
use \App\Helper\Helper;

class APIController extends BaseController
{

    public function __construct()
    {
        $this->beforeFilter('api_auth');
    }

    /*
     * Function I dropped in for testing to make sure model requests are returning the right values. Purely for development purposes.
     */

    public function getQuarterHourGos()
    {
        set_time_limit(36000);
        QuarterHourAggregate::chunk('200', function ($aggregates)
        {
            foreach ($aggregates as $aggregate)
            {
                $gos = WorkstreamData::select(DB::raw('SUM(under_threshold) as num_under_threshold'))
                                     ->where('start_time', '>', $aggregate->start_time)
                                     ->where('start_time', '<', $aggregate->end_time)
                                     ->where('workstream_id', '=', $aggregate->workstream_id)
                                     ->first();
                if (isset($gos->num_under_threshold))
                {
                    $aggregate->grade_of_service = $gos->num_under_threshold;
                } else
                {
                    $aggregate->grade_of_service = 0;
                }
                $aggregate->save();

            }
        });
    }

    public function getOtherGos()
    {
        set_time_limit(36000);
        HourAggregate::chunk('200', function ($aggregates)
        {
            foreach ($aggregates as $aggregate)
            {
                $gos = QuarterHourAggregate::select(DB::raw('SUM(grade_of_service) as grade_of_service'))
                                           ->where('start_time', '>=', $aggregate->start_time)
                                           ->where('end_time', '<=', $aggregate->end_time)
                                           ->where('workstream_id', '=', $aggregate->workstream_id)
                                           ->first();
                if (isset($gos->grade_of_service))
                {
                    $aggregate->grade_of_service = $gos->grade_of_service;
                } else
                {
                    $aggregate->grade_of_service = 0;
                }
                $aggregate->save();
            }
        });

        DayAggregate::chunk('200', function ($aggregates)
        {
            foreach ($aggregates as $aggregate)
            {
                $gos = HourAggregate::select(DB::raw('SUM(grade_of_service) as grade_of_service'))
                                    ->where('start_time', '>=', $aggregate->start_time)
                                    ->where('end_time', '<=', $aggregate->end_time)
                                    ->where('workstream_id', '=', $aggregate->workstream_id)
                                    ->first();
                if (isset($gos->grade_of_service))
                {
                    $aggregate->grade_of_service = $gos->grade_of_service;
                } else
                {
                    $aggregate->grade_of_service = 0;
                }
                $aggregate->save();
            }
        });

        MonthAggregate::chunk('200', function ($aggregates)
        {
            foreach ($aggregates as $aggregate)
            {
                $gos = DayAggregate::select(DB::raw('SUM(grade_of_service) as grade_of_service'))
                                   ->where('start_time', '>=', $aggregate->start_time)
                                   ->where('end_time', '<=', $aggregate->end_time)
                                   ->where('workstream_id', '=', $aggregate->workstream_id)
                                   ->first();
                if (isset($gos->grade_of_service))
                {
                    $aggregate->grade_of_service = $gos->grade_of_service;
                } else
                {
                    $aggregate->grade_of_service = 0;
                }
                $aggregate->save();
            }
        });
    }

    public function getWorkstreamDataGos()
    {
        set_time_limit(36000);
        $workstream_data = WorkstreamData::where('wait_time', '<=', 30)->get();

        foreach ($workstream_data as $point)
        {
            $point->under_threshold = true;
            $point->save();
        }
    }

    public function getDumpDump()
    {
        $timesheet_shifts = Timesheet::with('user')
                                     ->with('timesheetshift')
                                     ->orderBy('date_start', 'asc')
                                     ->get();

        $shift_array = [];
        $total_time_out = 0;

        foreach ($timesheet_shifts as $timesheet)
        {
            $temp_array = [
                'user' => $timesheet->user->first_name . " " . $timesheet->user->last_name,
                'timesheet week ending' => ExpressiveDate::make($timesheet->date_end)->getShortDate(),
            ];

            foreach ($timesheet->timesheetshift as $shift)
            {
                $start_time = new ExpressiveDate($shift->start_time);
                $finish_time = new ExpressiveDate($shift->finish_time);

                if (fmod($start_time->getDifferenceInHours($finish_time), 1) != 0)
                {
                    $temp_array['shifts'][] = [
                        'shift date' => ExpressiveDate::make($shift->start_time)->getShortDate(),
                        'amount of time out' => fmod($start_time->getDifferenceInHours($finish_time), 1)
                    ];
                    $total_time_out += fmod($start_time->getDifferenceInHours($finish_time), 1);
                }

            }

            if (isset($temp_array['shifts'])) $shift_array[] = $temp_array;
        }

        return Helper::jsonLoader(SUCCESS, array('total_timesheets' => count($shift_array), 'total_time_out' => $total_time_out, 'timesheets' => $shift_array));
    }

    public function getTest()
    {
        $shift = RosteredShift::where('id', '=', 170)->first();

        /*echo "Original rostered start time: ";
        echo $shift->rostered_start_time;
        echo "\nSet to user timezone: ";
        echo $shift->rostered_start_time->timezone(Auth::user()->timezone);
        echo "\nSet to 2014-06-10 20:00:00 at user timezone ". Auth::user()->timezone .": ";
        $new = new Carbon('2014-06-10 20:00:00', Auth::user()->timezone);
        //$new->setTimezone('UTC');
        echo $shift->rostered_start_time = $new;
        echo "<pre>";
        var_dump($new);
        echo "</pre>";
        echo "<pre>";
        var_dump($shift->rostered_start_time);
        echo "</pre>";
        $shift->rostered_start_time->setTimezone('UTC');
        echo "<pre>";
        var_dump($shift->rostered_start_time);
        echo "</pre>";
        echo "\nEchoed out: ";
        echo $shift->rostered_start_time;
        echo "\nSaved";
        $shift->save();

        $shift = RosteredShift::where('id', '=', 170)->first();
        echo "\nPrint out saved rostered start time at user's timezone: ";
        echo $shift->rostered_start_time->setTimezone(Auth::user()->timezone);
        echo "\nPrint out saved rostered start time: ";
        echo $shift->rostered_start_time;*/

        return Helper::jsonLoader(SUCCESS, $shift->toArray(Auth::user()->timezone));

    }

}

?>