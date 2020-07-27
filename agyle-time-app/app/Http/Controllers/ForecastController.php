<?php
use \App\Helper\Helper;
use Carbon\Carbon;
class ForecastController extends BaseController
{
    public function __construct()
    {
        $this->beforeFilter('api_auth');
    }

    public function forecasts()
    {
        return View::make('forecasts');
    }

    public function edit_forecast()
    {
        return View::make('edit_forecast');
    }

    public function forecast_index()
    {
        return View::make('forecast_index');
    }

    /*
     * Takes a JSON array with the following elements:
     * workstream_id - The Workstream ID for which we are requesting data
     * interval - the interval of the aggregates, options are 'quarter_hour', 'hour', 'day', 'month'
     * start_time - a starting timestamp, in the format 'YYYY-MM-DD HH:MM:SS'
     * end_time - an ending timestamp (will be checked against the end time of the last data point), in the format 'YYYY-MM-DD HH:MM:SS'
     * Returns a JSON array containing the full information for all data points between the given times
     */
    public function getAggregate()
    {
        $input = Input::all();

        if (!isset($input['workstream_id'], $input['interval'], $input['start_date'], $input['end_date']))
        {
            return Helper::jsonLoader(INCORRECT_DATA);
        }

        $input['start_time'] = new Carbon($input['start_date'], Helper::organisationTimezone());
        $input['start_time'] = $input['start_time']->timezone(Config::get('app.timezone'))->toDateTimeString();
        $input['end_time'] = new Carbon($input['end_date'], Helper::organisationTimezone());
        $input['end_time'] = $input['end_time']->endOfDay()->timezone(Config::get('app.timezone'))->toDateTimeString();

        $workstream = Workstream::where('id', '=', $input['workstream_id'])->first();

        switch ($input['interval'])
        {
            case 'quarter_hour':
                $aggregates = QuarterHourAggregate::where('workstream_id', '=', $input['workstream_id'])
                                                  ->where('start_time', '>=', $input['start_time'])
                                                  ->where('end_time', '<=', $input['end_time'])
                                                  ->orderBy('start_time', 'asc')
                                                  ->get();
                break;
            case 'hour':
                $aggregates = HourAggregate::where('workstream_id', '=', $input['workstream_id'])
                                           ->where('start_time', '>=', $input['start_time'])
                                           ->where('end_time', '<=', $input['end_time'])
                                           ->orderBy('start_time', 'asc')
                                           ->get();
                break;
            case 'day':
                $aggregates = DayAggregate::where('workstream_id', '=', $input['workstream_id'])
                                          ->where('start_time', '>=', $input['start_time'])
                                          ->where('end_time', '<=', $input['end_time'])
                                          ->orderBy('start_time', 'asc')
                                          ->get();
                break;
            case 'month':
                $aggregates = MonthAggregate::where('workstream_id', '=', $input['workstream_id'])
                                            ->where('start_time', '>=', $input['start_time'])
                                            ->where('end_time', '<=', $input['end_time'])
                                            ->orderBy('start_time', 'asc')
                                            ->get();
                break;
            default:
                return Helper::jsonLoader(INCORRECT_DATA);
        }

        return Helper::jsonLoader(SUCCESS, array('workstream' => $workstream->toArray(), 'data' => $aggregates->toArray()));
    }

    /*
     * Takes a JSON array with the following elements:
     * workstream_id - The Workstream ID for which we are requesting data
     * interval - the interval of the aggregates, options are 'quarter_hour', 'hour', 'day', 'month'
     * start_time - a starting timestamp, in the format 'YYYY-MM-DD HH:MM:SS'
     * end_time - an ending timestamp (will be checked against the end time of the last data point), in the format 'YYYY-MM-DD HH:MM:SS'
     * Optional - forecast_time - The date the forecast was made, will default to the latest data if not available
     * Returns a JSON array containing the full information for all data points between the given times
     */
    public function getForecast()
    {
        $input = Input::all();

        if (isset($input['workstream_id'], $input['interval'], $input['start_date'], $input['end_date']))
        {
            $input['start_time'] = new Carbon($input['start_date'], Helper::organisationTimezone());
            $input['start_time'] = $input['start_time']->startOfDay()->toDateTimeString();
            $input['end_time'] = new Carbon($input['end_date'], Helper::organisationTimezone());
            $input['end_time'] = $input['end_time']->endOfDay()->toDateTimeString();
            return $this->api_forecast($input);
        } else
        {
            return Helper::jsonLoader(INCORRECT_DATA);
        }
    }

    public function getPublishedForecasts()
    {
        $role_id = Input::get('role_id');
        $workstream_id = Input::get('workstream_id');
        $interval = Input::get('interval');
        $start_date = Input::get('start_date');
        $end_date = Input::get('end_date');

        $start_date = (isset($start_date)) ? new Carbon($start_date, Helper::organisationTimezone()) : null;
        $end_date = (isset($end_date)) ? new Carbon($end_date, Helper::organisationTimezone()) : null;

        $workstream_ids = [];
        if (isset($role_id))
        {
            $workstreams = Workstream::whereOrganisationId(Auth::user()->id)->whereRoleId($role_id)->get();
            foreach ($workstreams as $workstream)
            {
                $workstream_ids[] = $workstream->id;
            }
        }
        if (isset($workstream_id)) $workstream_ids[] = $workstream_id;

        $forecasts = PublishedForecast::whereOrganisationId(Auth::user()->organisation_id)
                                      ->where(function ($query) use ($workstream_ids, $start_date, $end_date, $interval)
                                      {
                                          if (count($workstream_ids) > 0) $query->whereIn('workstream_id', $workstream_ids);
                                          if (isset($start_date)) $query->where('start_date', '>=', $start_date->startOfWeek()->toDateString());
                                          if (isset($end_date)) $query->where('end_date', '<=', $end_date->endOfWeek()->toDateString());
                                          if (isset($interval)) $query->whereInterval($interval);
                                      })
                                      ->get();

        return Helper::jsonLoader(SUCCESS, $forecasts->toArray());
    }

    public function getPublishedForecast()
    {
        $forecast_id = Input::get('forecast_id');
        if (!isset($forecast_id))
        {
            if (!Input::has('name', 'workstream_id', 'interval', 'start_date', 'end_date'))
                return Helper::jsonLoader(INCORRECT_DATA);

            $input = Input::all();
            $forecasts = $this->forecast($input['workstream_id'], $input['interval'], $input['start_date'], $input['end_date'])['data'];

            try
            {
                $p_forecast = PublishedForecast::create(
                    [
                        'name' => $input['name'],
                        'description' => $input['description'],
                        'workstream_id' => $input['workstream_id'],
                        'interval' => $input['interval'],
                        'organisation_id' => Auth::user()->organisation_id,
                        'start_date' => $input['start_date'],
                        'end_date' => $input['end_date']
                    ]
                );
                $forecast_id = $p_forecast->id;
                $forecast_points = $this->forecastPoints($forecasts, $forecast_id);

                if (count($forecast_points) > 0) ForecastPoint::insert($forecast_points);
            } catch (Exception $e)
            {
                return Helper::jsonLoader(EXCEPTION, ['message' => $e->getMessage(), 'code' => $e->getCode()]);
            }
        }
        if (!is_array($forecast_id)) $forecast_id = [$forecast_id];
        $p_forecast = PublishedForecast::whereIn('id', $forecast_id)->with('forecastpoint')->get();
        if (!isset($p_forecast)) return Helper::jsonLoader(DATA_NOT_FOUND);

        return Helper::jsonLoader(SUCCESS, $p_forecast->toArray());
    }

    private function forecastPoints($forecasts, $forecast_id)
    {
        $temp = [];
        foreach ($forecasts as $forecast)
        {
            $temp[] = [
                'published_forecast_id' => $forecast_id,
                'start_time' => Carbon::parse($forecast->prediction_start_time, Helper::organisationTimezone())->timezone(Config::get('app.timezone'))->toDateTimeString(),
                'end_time' => Carbon::parse($forecast->prediction_end_time, Helper::organisationTimezone())->timezone(Config::get('app.timezone'))->toDateTimeString(),
                'workload' => $forecast->expected_workload,
                'volume' => $forecast->expected_volume,
                'average_handle_time' => $forecast->expected_average_handle_time
            ];
        }

        return $temp;
    }

    public function postPublishedForecast()
    {
        $input = json_decode(Input::get('data'), true);

        if (!isset($input['id'], $input['name'], $input['description'], $input['forecast_points']))
            return Helper::jsonLoader(INCORRECT_DATA);

        try
        {
            PublishedForecast::whereId($input['id'])->update([
                'name' => $input['name'],
                'description' => $input['description'],
            ]);

            foreach ($input['forecast_points'] as $point)
            {
                ForecastPoint::whereId($point['id'])->update([
                    'volume' => $point['volume'],
                    'workload' => $point['workload'],
                    'average_handle_time' => $point['aht']
                ]);
            }
        } catch (Exception $e)
        {
            return Helper::jsonLoader(EXCEPTION, ['code' => $e->getCode(), 'message' => $e->getMessage()]);
        }

        return Helper::jsonLoader(SUCCESS);
    }

    public function getTeamForecast()
    {
        $input = Input::all();

        if (isset($input['team_id'], $input['interval'], $input['start_time'], $input['end_time']))
        {
            if ($input['team_id'] == 2)
            {
                $input['workstream_id'] = 2;
            } else
            {
                $input['workstream_id'] = 2;
            }

            return $this->api_forecast($input);
        } else
        {
            return Helper::jsonLoader(INCORRECT_DATA);
        }
    }

    public function getRoleForecast()
    {
        $input = Input::all();

        if (isset($input['role_id'], $input['interval'], $input['start_time'], $input['end_time']))
        {
            $forecast = [];

            $workstreams = Workstream::where('role_id', '=', $input['role_id'])->get();

            foreach ($workstreams as $workstream)
            {
                $forecast[] = $this->forecast($workstream->id, $input['interval'], $input['start_time'], $input['end_time']);
            }

            return Helper::jsonLoader(SUCCESS, $forecast);
        } else
        {
            return Helper::jsonLoader(INCORRECT_DATA);
        }
    }

    private function api_forecast($input)
    {
        return Helper::jsonLoader(SUCCESS, $this->forecast($input['workstream_id'], $input['interval'], $input['start_time'], $input['end_time'], isset($input['forecast_time'])));
    }

    private function forecast($workstream_id, $interval, $start_time, $end_time, $forecast_time = false)
    {
        $workstream = Workstream::where('id', '=', $workstream_id)->first();
        $user_timezone = Helper::organisationTimezone();

        switch ($interval)
        {
            case 'quarter hour':
            case 'quarter_hour':
                $forecast_table = 'quarter_hour_forecasts';
                break;
            case 'hour':
                $forecast_table = 'hour_forecasts';
                break;
            case 'day':
                $forecast_table = 'day_forecasts';
                break;
            case 'month':
                $forecast_table = 'month_forecasts';
                break;
            default:
                return Helper::jsonLoader(INCORRECT_DATA);
        }

        $tz_start_time = Carbon::parse($start_time, $user_timezone)->startOfDay()->timezone(Config::get('app.timezone'));
        $tz_end_time = Carbon::parse($end_time, $user_timezone)->endOfDay()->timezone(Config::get('app.timezone'));

        if ($forecast_time)
        {
            $forecasts = DB::connection('forecast_mysql')
                           ->table($forecast_table)
                           ->where('workstream_id', '=', $workstream_id)
                           ->where('prediction_start_time', '>=', $tz_start_time->toDateTimeString())
                           ->where('prediction_end_time', '<=', $tz_end_time->toDateTimeString())
                           ->where('created_at', '=', $forecast_time)
                           ->get();
        } else
        {
            $forecasts = DB::connection('forecast_mysql')
                           ->select("select *
                                     from (
                                        select *
                                        from $forecast_table
                                        where prediction_start_time >= ?
                                        AND prediction_end_time <= ?
                                        AND workstream_id = ?
                                        order by created_at asc
                                     ) as a
                                     group by a.prediction_start_time
                                     order by a.prediction_start_time desc",
                               array($tz_start_time->toDateTimeString(), $tz_end_time->toDateTimeString(), $workstream_id));
        }

        foreach ($forecasts as $key => $forecast)
        {
            if ($forecast->created_at !== '0000-00-00 00:00:00')
                $forecasts[$key]->created_at = Carbon::parse($forecast->created_at)->timezone($user_timezone)->toDateTimeString();
            if ($forecast->updated_at !== '0000-00-00 00:00:00')
                $forecasts[$key]->updated_at = Carbon::parse($forecast->updated_at)->timezone($user_timezone)->toDateTimeString();
            if ($forecast->prediction_start_time !== '0000-00-00 00:00:00')
                $forecasts[$key]->prediction_start_time = Carbon::parse($forecast->prediction_start_time)->timezone($user_timezone)->toDateTimeString();
            if ($forecast->prediction_end_time !== '0000-00-00 00:00:00')
                $forecasts[$key]->prediction_end_time = Carbon::parse($forecast->prediction_end_time)->timezone($user_timezone)->toDateTimeString();
        }

        return array('workstream' => $workstream->toArray(), 'data' => $forecasts);
    }

    public function getReportTotals()
    {
        $input = Input::all();

        if (!isset($input['workstream_id'], $input['interval'], $input['start_date'], $input['end_date']))
        {
            return Helper::jsonLoader(INCORRECT_DATA);
        }

        $aggregates = QuarterHourAggregate::select(DB::raw('sum(grade_of_service) as grade_of_service, sum(total_handle_time) as total_handle_time, sum(volume) as volume'))
                                          ->where('workstream_id', '=', $input['workstream_id'])
                                          ->where('start_time', '>=', $input['start_date'] . " " . '00:00:00')
                                          ->where('end_time', '<=', $input['end_date'] . " " . '23:59:59')
                                          ->groupBy('workstream_id')
                                          ->first();


        $averages = [];
        if (isset($aggregates->volume) && $aggregates->volume != 0)
        {
            $averages['average_handle_time'] = $aggregates->total_handle_time / $aggregates->volume;
            $averages['grade_of_service'] = $aggregates->grade_of_service / $aggregates->volume * 100;
        } else
        {
            $averages['average_handle_time'] = 0;
            $averages['grade_of_service'] = 0;
        }

        $averages['occupancy'] = $this->workstreamOccupancy($input['workstream_id'], $input['start_date'], $input['end_date']);

        return Helper::jsonLoader(SUCCESS, $averages);
    }

    private function workstreamOccupancy($workstream_id, $start_time, $end_time)
    {
        $agents = WorkstreamData::select('agent_alias')->where('workstream_id', '=', $workstream_id)
                                ->where('start_time', '>', $start_time)
                                ->where('end_time', '<', $end_time)
                                ->groupBy('agent_alias')
                                ->get();

        $agent_array = [];
        foreach ($agents as $agent)
        {
            $agent_array[] = $agent->agent_alias;
        }

        $workstream_aggregates = WorkstreamData::select(DB::raw('sum(handle_time) as total_handle_time'))
                                               ->where('start_time', '>', $start_time)
                                               ->where('end_time', '<', $end_time)
                                               ->whereIn('agent_alias', $agent_array)
                                               ->first();
        $shift_aggregates = ShiftData::select(DB::raw('sum(shift_length) as total_shift_time'))
                                     ->where('start_time', '>', $start_time)
                                     ->where('end_time', '<', $end_time)
                                     ->whereIn('agent_alias', $agent_array)
                                     ->first();

        if (!isset($shift_aggregates) || $shift_aggregates->total_shift_length == 0 || !isset($workstream_aggregates) || $workstream_aggregates->total_handle_time == 0)
            return -1;
        else if ($workstream_aggregates->total_handle_time > $shift_aggregates->total_shift_length)
        {
            return 100;
        } else
        {
            return $workstream_aggregates->total_handle_time / $shift_aggregates->total_shift_length * 100;
        }
    }
}