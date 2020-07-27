<?php
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Models\Roster\Revision;
use App\Models\Roster\RevisionShift;
use App\Helper\Helper;
use Carbon\Carbon;

class RevisionController extends Controller
{
    public function getRevision()
    {
        $input = Input::all();
        if (isset($input['date_start'], $input['date_end'], $input['team_id'])) {
            try {
                if ($input['date_start'] == $input['date_end']) {
                    $revisions = Revision::whereDate('date_start', '<=', $input['date_start'])
                        ->whereDate('date_end', '>=', $input['date_end'])
                        ->where('organisation_id', Auth::user()->organisation->id)
                        ->where('team_id', $input['team_id'])
                        ->with('modifiedBy', 'revisionShifts.newUser', 'revisionShifts.oldUser', 'revisionShifts.task')
                        ->get();
                } else {
                    $revisions = Revision::whereDate('date_start', '>=', $input['date_start'])
                        ->whereDate('date_end', '<=', $input['date_end'])
                        ->where('organisation_id', Auth::user()->organisation->id)
                        ->where('team_id', $input['team_id'])
                        ->with('modifiedBy', 'revisionShifts.newUser', 'revisionShifts.oldUser', 'revisionShifts.task')
                        ->get();
                }

            } catch (Exception $e) {
                return Helper::jsonLoader(EXCEPTION, array("message" => $e->getMessage(), "line" => $e->getLine(), "file" => $e->getFile()));
            }
            foreach ($revisions as $revision) {
                $created_at = new Carbon($revision->created_at, 'UTC');
                $created_at = $created_at->timezone(Helper::organisationTimezone());
                $revision->created_at = $created_at->toDateTimeString();
                foreach ($revision->revisionShifts as $shift) {
                    if (isset($shift->old_start_time)) {
                        $temp = new Carbon($shift->old_start_time, 'UTC');
                        $temp = $temp->timezone(Helper::organisationTimezone());
                        $shift->old_start_time = $temp->toDateTimeString();
                    }
                    if (isset($shift->new_start_time)) {
                        $temp = new Carbon($shift->new_start_time, 'UTC');
                        $temp = $temp->timezone(Helper::organisationTimezone());
                        $shift->new_start_time = $temp->toDateTimeString();
                    }
                    if (isset($shift->old_end_time)) {
                        $temp = new Carbon($shift->old_end_time, 'UTC');
                        $temp = $temp->timezone(Helper::organisationTimezone());
                        $shift->old_end_time = $temp->toDateTimeString();
                    }
                    if (isset($shift->new_end_time)) {
                        $temp = new Carbon($shift->new_end_time, 'UTC');
                        $temp = $temp->timezone(Helper::organisationTimezone());
                        $shift->new_end_time = $temp->toDateTimeString();
                    }
                }
            }
            if ($input['date_start'] == $input['date_end']) {
                $date = $input['date_start'];
                $counter = 0;
                $remove_list = [];
                foreach($revisions as $revision) {
                    $hasRevisionOnThisDate = false;
                    foreach ($revision->revisionShifts as $shift) {
                        if(isset($shift->old_date)) {
                            if($shift->old_date == $date) {
                                $hasRevisionOnThisDate = true;
                            }
                        }
                        if(isset($shift->new_date)) {
                            if($shift->new_date == $date) {
                                $hasRevisionOnThisDate = true;
                            }
                        }
                        if(isset($shift->old_start_time)) {
                            $temp_date = new Carbon($shift->old_start_time);
                            $temp_date = $temp_date->toDateString();
                            if($temp_date == $date) {
                                $hasRevisionOnThisDate = true;
                            }
                        }
                        if(isset($shift->old_end_time)) {
                            $temp_date = new Carbon($shift->old_end_time);
                            $temp_date = $temp_date->toDateString();
                            if($temp_date == $date) {
                                $hasRevisionOnThisDate = true;
                            }
                        }
                        if(isset($shift->new_start_time)) {
                            $temp_date = new Carbon($shift->new_start_time);
                            $temp_date = $temp_date->toDateString();
                            if($temp_date == $date) {
                                $hasRevisionOnThisDate = true;
                            }
                        }
                        if(isset($shift->new_end_time)) {
                            $temp_date = new Carbon($shift->new_end_time);
                            $temp_date = $temp_date->toDateString();
                            if($temp_date == $date) {
                                $hasRevisionOnThisDate = true;
                            }
                        }
                        if(isset($shift->old_shift_task_start_time)) {
                            $temp_date = new Carbon($shift->old_shift_task_start_time);
                            $temp_date = $temp_date->toDateString();
                            if($temp_date == $date) {
                                $hasRevisionOnThisDate = true;
                            }
                        }
                        if(isset($shift->old_shift_task_end_time)) {
                            $temp_date = new Carbon($shift->old_shift_task_end_time);
                            $temp_date = $temp_date->toDateString();
                            if($temp_date == $date) {
                                $hasRevisionOnThisDate = true;
                            }
                        }
                        if(isset($shift->new_shift_task_start_time)) {
                            $temp_date = new Carbon($shift->new_shift_task_start_time);
                            $temp_date = $temp_date->toDateString();
                            if($temp_date == $date) {
                                $hasRevisionOnThisDate = true;
                            }
                        }
                        if(isset($shift->new_shift_task_end_time)) {
                            $temp_date = new Carbon($shift->new_shift_task_end_time);
                            $temp_date = $temp_date->toDateString();
                            if($temp_date == $date) {
                                $hasRevisionOnThisDate = true;
                            }
                        }
                    }
                    if($hasRevisionOnThisDate == false ) {
                        array_push($remove_list, $counter);
                    }
                    $counter ++;
                }
                foreach($remove_list as $index) {
                    $revisions->splice($index, 1);
                }
            }
            return Helper::jsonLoader(SUCCESS, $revisions);
        } else {
            return Helper::jsonLoader(INCORRECT_DATA);
        }
    }

    public function postRevision()
    {

    }
}
