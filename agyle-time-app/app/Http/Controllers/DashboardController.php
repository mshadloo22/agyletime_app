<?
use \App\Helper\Helper;
use Carbon\Carbon;
class DashboardController extends BaseController
{
    public function __construct()
    {
        $this->beforeFilter('api_auth');
    }

    public function get_dashboard()
    {
        switch (Helper::managementStatus())
        {
            case NOT_MANAGEMENT:
                return $this->user_dashboard();
            default:
                return $this->user_dashboard();
        }
    }

    private function user_dashboard()
    {
        $start_date = Carbon::now();
        $end_date = $start_date->copy();
        $start_date->subMonths(2);

        $timesheets = Timesheet::where('date_end', '<=', $end_date->toDateString())
                               ->where('date_end', '>=', $start_date->toDateString())
                               ->where('user_id', '=', Auth::user()->id)
                               ->orderBy('approval_stage', 'asc')
                               ->limit(10)
                               ->get(array('id', 'date_end', 'approval_stage'));

        $start_date->addMonths(2);
        $start_date->startOfWeek();
        $end_date->addWeek();
        $end_date->endOfWeek();

        $rosters = Roster::where('date_start', '>=', $start_date->toDateString())
                         ->where('date_ending', '<=', $end_date->toDateString())
                         ->where('roster_stage', '=', 'released')
                         ->where('team_id', '=', Auth::user()->team_id)
                         ->with('rosteredshift', function ($query)
                         {
                             $query->where('user_id', '=', Auth::user()->id);
                         })
                         ->orderBy('date_start', 'desc')
                         ->get();


        $this_week_shifts = $this->generateShiftArray($start_date->copy(), $rosters);
        $next_week_shifts = $this->generateShiftArray($start_date->copy()->addWeek(), $rosters);

        return View::make('user_dashboard')
                   ->with('timesheets', $timesheets->toArray())
                   ->with('this_week_shifts', $this_week_shifts)
                   ->with('next_week_shifts', $next_week_shifts);
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

        for ($i = 0; $i < 7; $i++)
        {
            $date = $start_date->copy()->addDays($i);
        }

        foreach ($rosters as $roster)
        {
            $roster_element = [];
            $roster_element['team_name'] = $roster->team->name;
            $roster_element['team_id'] = $roster->team->id;
            $roster_element['start_date'] = $start_date;
        }
    }

    private function generateShiftArray($start_date, $rosters)
    {
        $week_shifts = [];
        $roster_id = null;

        for ($i = 0; $i < 7; $i++)
        {
            $date = $start_date->copy()->addDays($i);
            $temp_shift = null;
            foreach ($rosters as $roster)
            {
                if ($roster->date_start == $date)
                {
                    $roster_id = $roster->id;
                }
                foreach ($roster->rostered_shift as $shift)
                {
                    if ($date->getDate() == $shift->date)
                    {
                        $temp_shift = $shift;
                    }
                }
            }

            $week_shifts[$i] = [
                $date,
                $temp_shift->toArray()
            ];
        }

        return array('roster_id' => $roster_id, 'shifts' => $week_shifts);
    }
}