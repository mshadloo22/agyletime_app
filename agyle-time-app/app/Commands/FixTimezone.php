<?php

use Illuminate\Console\Command;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Input\InputArgument;

class FixTimezone extends Command {

	/**
	 * The console command name.
	 *
	 * @var string
	 */
	protected $name = 'command:fix-timezone';

	/**
	 * The console command description.
	 *
	 * @var string
	 */
	protected $description = 'Changes various timezones in the DB to UTC from Australia/Melbourne.';

	/**
	 * Create a new command instance.
	 *
	 * @return void
	 */
	public function __construct()
	{
		parent::__construct();
	}

	/**
	 * Execute the console command.
	 *
	 * @return mixed
	 */
	public function fire()
	{
		switch($this->option('function')) {
            case 'main':
                $this->getFixTimezones();
                break;
            case 'aggregates':
                $this->getFixAggregateTimezones();
                break;
            case 'forecasts':
                $this->getFixForecastTimezones();
                break;
            case 'raw':
                $this->getFixDataTimezones();
                break;
            default:
                $this->error('function choice not selected! choose main, aggregates, forecasts or raw.');
        }

        $this->info('Timezone fixes complete.');
	}

	/**
	 * Get the console command arguments.
	 *
	 * @return array
	 */
	protected function getArguments()
	{
		return array(

		);
	}

	/**
	 * Get the console command options.
	 *
	 * @return array
	 */
	protected function getOptions()
	{
		return array(
			array('function', null, InputOption::VALUE_OPTIONAL, 'Select which function you wish to run.', null),
		);
	}

    private function getFixTimezones()
    {
        DB::disableQueryLog();
        set_time_limit(0);
        $old_tz = "Australia/Melbourne";
        $new_tz = "UTC";
        AvailGeneral::chunk(200, function($avails) use ($old_tz, $new_tz) {
            foreach($avails as $avail) {
                $avail->start_time = Carbon::createFromFormat("H:i:s", $avail->start_time, $old_tz)->timezone($new_tz)->toTimeString();
                $avail->end_time = Carbon::createFromFormat("H:i:s", $avail->end_time, $old_tz)->timezone($new_tz)->toTimeString();
                $avail->save();
            }
        });

        $this->info('AvailGeneral Complete.');

        AvailSpecific::chunk(200, function($avails) use ($old_tz, $new_tz) {
            foreach($avails as $avail) {
                if(isset($avail->start_time))
                    $avail->start_time = Carbon::createFromFormat("H:i:s", $avail->start_time, $old_tz)->timezone($new_tz)->toTimeString();

                if(isset($avail->end_time))
                    $avail->end_time = Carbon::createFromFormat("H:i:s", $avail->end_time, $old_tz)->timezone($new_tz)->toTimeString();

                $avail->save();
            }
        });

        $this->info('AvailSpecific Complete.');

        RosteredShift::chunk(200, function($shifts) use ($old_tz, $new_tz) {
            foreach($shifts as $shift) {
                $shift->rostered_start_time = Carbon::parse($shift->rostered_start_time->toDateTimeString(), $old_tz)->timezone($new_tz)->toDateTimeString();
                $shift->rostered_end_time = Carbon::parse($shift->rostered_end_time->toDateTimeString(), $old_tz)->timezone($new_tz)->toDateTimeString();
                $shift->save();
            }
        });

        $this->info('RosteredShift Complete.');

        ScheduledShift::chunk(200, function($shifts) use ($old_tz, $new_tz) {
            foreach($shifts as $shift) {
                $shift->start_time = Carbon::parse($shift->start_time->toDateTimeString(), $old_tz)->timezone($new_tz)->toDateTimeString();
                $shift->end_time = Carbon::parse($shift->end_time->toDateTimeString(), $old_tz)->timezone($new_tz)->toDateTimeString();
                $shift->save();
            }
        });

        $this->info('ScheduledShift Complete.');

        ShiftTask::chunk(200, function($tasks) use ($old_tz, $new_tz) {
            foreach($tasks as $task) {
                $task->start_time = Carbon::parse($task->start_time->toDateTimeString(), $old_tz)->timezone($new_tz)->toDateTimeString();
                $task->end_time = Carbon::parse($task->end_time->toDateTimeString(), $old_tz)->timezone($new_tz)->toDateTimeString();
                $task->save();
            }
        });

        $this->info('ShiftTask Complete.');

        TimesheetShift::chunk(200, function($shifts) use ($old_tz, $new_tz) {
            foreach($shifts as $shift) {
                $shift->start_time = Carbon::parse($shift->start_time->toDateTimeString(), $old_tz)->timezone($new_tz)->toDateTimeString();
                $shift->finish_time = Carbon::parse($shift->finish_time->toDateTimeString(), $old_tz)->timezone($new_tz)->toDateTimeString();
                $shift->save();
            }
        });

        $this->info('TimesheetShift Complete.');
    }

    private function getFixAggregateTimezones()
    {
        DB::disableQueryLog();
        set_time_limit(0);
        $old_tz = "Australia/Melbourne";
        $new_tz = "UTC";
        $start_of_time = "0000-00-00 00:00:00";

        QuarterHourAggregate::chunk(200, function($data) use ($old_tz, $new_tz, $start_of_time) {
            foreach($data as $datum) {
                if($datum->start_time != $start_of_time)
                    $datum->start_time = Carbon::parse($datum->start_time->toDateTimeString(), $old_tz)->timezone($new_tz)->toDateTimeString();
                if($datum->end_time != $start_of_time)
                    $datum->end_time = Carbon::parse($datum->end_time->toDateTimeString(), $old_tz)->timezone($new_tz)->toDateTimeString();

                $datum->save();
            }
        });

        $this->info('Quarter Hour Complete.');

        HourAggregate::chunk(200, function($data) use ($old_tz, $new_tz, $start_of_time) {
            foreach($data as $datum) {
                if($datum->start_time != $start_of_time)
                    $datum->start_time = Carbon::parse($datum->start_time->toDateTimeString(), $old_tz)->timezone($new_tz)->toDateTimeString();
                if($datum->end_time != $start_of_time)
                    $datum->end_time = Carbon::parse($datum->end_time->toDateTimeString(), $old_tz)->timezone($new_tz)->toDateTimeString();

                $datum->save();
            }
        });

        $this->info('Hour Complete.');

        DayAggregate::chunk(200, function($data) use ($old_tz, $new_tz, $start_of_time) {
            foreach($data as $datum) {
                if($datum->start_time != $start_of_time)
                    $datum->start_time = Carbon::parse($datum->start_time->toDateTimeString(), $old_tz)->timezone($new_tz)->toDateTimeString();
                if($datum->end_time != $start_of_time)
                    $datum->end_time = Carbon::parse($datum->end_time->toDateTimeString(), $old_tz)->timezone($new_tz)->toDateTimeString();

                $datum->save();
            }
        });

        $this->info('Day Complete.');

        MonthAggregate::chunk(200, function($data) use ($old_tz, $new_tz, $start_of_time) {
            foreach($data as $datum) {
                if($datum->start_time != $start_of_time)
                    $datum->start_time = Carbon::parse($datum->start_time->toDateTimeString(), $old_tz)->timezone($new_tz)->toDateTimeString();
                if($datum->end_time != $start_of_time)
                    $datum->end_time = Carbon::parse($datum->end_time->toDateTimeString(), $old_tz)->timezone($new_tz)->toDateTimeString();

                $datum->save();
            }
        });

        $this->info('Month Complete.');
    }

    private function getFixForecastTimezones()
    {
        DB::disableQueryLog();
        set_time_limit(0);
        $old_tz = "Australia/Melbourne";
        $new_tz = "UTC";
        $start_of_time = "0000-00-00 00:00:00";

        QuarterHourForecast::chunk(200, function($data) use ($old_tz, $new_tz, $start_of_time) {
            foreach($data as $datum) {
                if($datum->prediction_start_time != $start_of_time)
                    $datum->prediction_start_time = Carbon::parse($datum->prediction_start_time->toDateTimeString(), $old_tz)->timezone($new_tz)->toDateTimeString();
                if($datum->prediction_end_time != $start_of_time)
                    $datum->prediction_end_time = Carbon::parse($datum->prediction_end_time->toDateTimeString(), $old_tz)->timezone($new_tz)->toDateTimeString();

                $datum->save();
            }
        });

        $this->info('Quarter Hour Complete.');

        HourForecast::chunk(200, function($data) use ($old_tz, $new_tz, $start_of_time) {
            foreach($data as $datum) {
                if($datum->prediction_start_time != $start_of_time)
                    $datum->prediction_start_time = Carbon::parse($datum->prediction_start_time->toDateTimeString(), $old_tz)->timezone($new_tz)->toDateTimeString();
                if($datum->prediction_end_time != $start_of_time)
                    $datum->prediction_end_time = Carbon::parse($datum->prediction_end_time->toDateTimeString(), $old_tz)->timezone($new_tz)->toDateTimeString();

                $datum->save();
            }
        });

        $this->info('Hour Complete.');

        DayForecast::chunk(200, function($data) use ($old_tz, $new_tz, $start_of_time) {
            foreach($data as $datum) {
                if($datum->prediction_start_time != $start_of_time)
                    $datum->prediction_start_time = Carbon::parse($datum->prediction_start_time->toDateTimeString(), $old_tz)->timezone($new_tz)->toDateTimeString();
                if($datum->prediction_end_time != $start_of_time)
                    $datum->prediction_end_time = Carbon::parse($datum->prediction_end_time->toDateTimeString(), $old_tz)->timezone($new_tz)->toDateTimeString();

                $datum->save();
            }
        });

        $this->info('Day Complete.');

        MonthForecast::chunk(200, function($data) use ($old_tz, $new_tz, $start_of_time) {
            foreach($data as $datum) {
                if($datum->prediction_start_time != $start_of_time)
                    $datum->prediction_start_time = Carbon::parse($datum->prediction_start_time->toDateTimeString(), $old_tz)->timezone($new_tz)->toDateTimeString();
                if($datum->prediction_end_time != $start_of_time)
                    $datum->prediction_end_time = Carbon::parse($datum->prediction_end_time->toDateTimeString(), $old_tz)->timezone($new_tz)->toDateTimeString();

                $datum->save();
            }
        });

        $this->info('Month Complete.');
    }

    private function getFixDataTimezones()
    {
        DB::disableQueryLog();
        set_time_limit(0);
        $old_tz = "Australia/Melbourne";
        $new_tz = "UTC";
        $start_of_time = "0000-00-00 00:00:00";

        WorkstreamData::chunk(200, function($data) use ($old_tz, $new_tz, $start_of_time) {
            foreach($data as $datum) {
                if($datum->start_time != $start_of_time)
                    $datum->start_time = Carbon::parse($datum->start_time->toDateTimeString(), $old_tz)->timezone($new_tz)->toDateTimeString();
                if($datum->end_time != $start_of_time)
                    $datum->end_time = Carbon::parse($datum->end_time->toDateTimeString(), $old_tz)->timezone($new_tz)->toDateTimeString();
                $datum->save();
            }
        });

        $this->info('Workstream Data Complete.');

        ShiftData::chunk(200, function($data) use ($old_tz, $new_tz, $start_of_time) {
            foreach($data as $datum) {
                if($datum->start_time != $start_of_time)
                    $datum->start_time = Carbon::parse($datum->start_time->toDateTimeString(), $old_tz)->timezone($new_tz)->toDateTimeString();
                if($datum->end_time != $start_of_time)
                    $datum->end_time = Carbon::parse($datum->end_time->toDateTimeString(), $old_tz)->timezone($new_tz)->toDateTimeString();
                if($datum->last_ping != $start_of_time)
                    $datum->last_ping = Carbon::parse($datum->last_ping->toDateTimeString(), $old_tz)->timezone($new_tz)->toDateTimeString();
                $datum->save();
            }
        });

        $this->info('Shift Data Complete.');

        TaskData::chunk(200, function($data) use ($old_tz, $new_tz, $start_of_time) {
            foreach($data as $datum) {
                if($datum->start_time != $start_of_time)
                    $datum->start_time = Carbon::parse($datum->start_time->toDateTimeString(), $old_tz)->timezone($new_tz)->toDateTimeString();
                if($datum->end_time != $start_of_time)
                    $datum->end_time = Carbon::parse($datum->end_time->toDateTimeString(), $old_tz)->timezone($new_tz)->toDateTimeString();

                $datum->save();
            }
        });

        $this->info('Task Data Complete.');
    }

}
