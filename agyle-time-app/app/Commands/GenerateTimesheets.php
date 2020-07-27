<?php

use Illuminate\Console\Command;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Input\InputArgument;

class GenerateTimesheets extends Command {

	/**
	 * The console command name.
	 *
	 * @var string
	 */
	protected $name = 'command:generate-timesheets';

	/**
	 * The console command description.
	 *
	 * @var string
	 */
	protected $description = 'Generates outstanding timesheets for the prior 2 weeks.';

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
        $now = new Carbon;
        $now->endOfWeek();

        DB::disableQueryLog();

		User::where('active', '=', true)
            ->with(array('timesheet' => function($query) use ($now) {
                $query->where('date_end', '=', $now->toDateString())
                    ->orWhere('date_end', '=' , $now->copy()->subWeek()->toDateString())
                    ->orWhere('date_end', '=', $now->copy()->subWeeks(2)->toDateString());
            }))
            ->chunk(100, function($users) use ($now) {
                foreach($users as $user) {
                    $this_week = true;
                    $last_week = true;
                    $two_weeks_ago = true;

                    foreach($user->timesheet as $timesheet) {
                        if($timesheet->date_end->toDateString() == $now->toDateString())
                        {
                            $this_week = false;
                        } else
                        {

                            if($timesheet->date_end->toDateString() == $now->copy()->subWeek()->toDateString()) $last_week = false;
                            if($timesheet->date_end->toDateString() == $now->copy()->subWeeks(2)->toDateString()) $two_weeks_ago = false;

                            if($timesheet->approval_stage == 'unopened' || $timesheet->approval_stage == 'not_submitted')
                                Email::sendTimesheetReminder($timesheet, $user);
                        }
                    }

                    if($this_week) $this->blankTimesheet($user->id, $now->copy()->startOfWeek(), $now);

                    if($last_week) {
                        $timesheet = $this->blankTimesheet($user->id, $now->copy()->subWeek()->startOfWeek(), $now->copy()->subWeek());
                        Email::sendTimesheetReminder($timesheet, $user);
                    }

                    if($two_weeks_ago) {
                        $timesheet = $this->blankTimesheet($user->id, $now->copy()->subWeeks(2)->startOfWeek(), $now->copy()->subWeeks(2));
                        Email::sendTimesheetReminder($timesheet, $user);
                    }
                }
            });
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

		);
	}

    private function blankTimesheet($user_id, Carbon $start_date, Carbon $end_date)
    {
        $timesheet = new Timesheet;
        $timesheet->user_id = $user_id;
        $timesheet->date_start = $start_date->toDateString();
        $timesheet->date_end = $end_date->toDateString();
        $timesheet->approval_stage = 'unopened';
        $timesheet->save();
        $timesheet->integration()->attach(1, array('sent' => 0));

        return $timesheet;
    }


}
