<?php
use \App\Helper\Helper;
use Carbon\Carbon;
class PerformanceController extends BaseController
{
    public function __construct()
    {
        $this->beforeFilter('api_auth');
    }

    private function checkShiftAdherence($rostered_shift, $actual_shift, $tasks, $lengths_only = false)
    {
        $rostered_shift->setTimezone(Helper::organisationTimezone());
        if ($actual_shift !== null) $actual_shift->setTimezone(Helper::organisationTimezone());
        $r_range = new CarbonRange($rostered_shift->rostered_start_time, $rostered_shift->rostered_end_time);
        $a_range = $actual_shift !== null ? new CarbonRange($actual_shift->start_time, $actual_shift->end_time) : null;

        $out_of_adherence['shift'] = $this->checkAdherence($r_range, $a_range);

        foreach ($out_of_adherence['shift']['periods'] as $periods)
        {
            $out_of_adherence['shift']['total_time'] += $periods->diff('seconds');
        }

        return $out_of_adherence;
    }

    private function checkAdherence(CarbonRange $rostered, $actuals)
    {
        $periods = [];

        foreach ($actuals as $actual)
        {
            $periods = array_merge(
                $periods,
                $rostered->subtract($actual),
                $actual->subtract($rostered)
            );
        }
    }

    private function defaultActual($rostered)
    {
        $now = new Carbon(Helper::organisationTimezone());

        if ($now->gt($rostered->end))
        {
            return $rostered->copy();
        } else if ($now->gt($rostered->start))
        {
            return new CarbonRange($rostered->start->copy(), $now->copy());
        }

        return null;
    }
}

?>