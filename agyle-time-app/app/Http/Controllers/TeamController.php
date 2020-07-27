<?php
use \App\Helper\Helper;

class TeamController extends BaseController
{

    public function manage_users()
    {
        switch (Helper::managementStatus()) {
            case MANAGER:
                $team_obj = Team::where(function ($query) {
                    $query->where('team_leader_id', '=', Auth::user()->id)
                        ->orWhere('manager_id', '=', Auth::user()->id);
                })->get();
                break;
            case PRIMARY_CONTACT:
                $team_obj = Team::where('organisation_id', '=', Auth::user()->organisation_id)->get();
                break;
            default:
                return Helper::jsonLoader(UNAUTHORIZED_ACCESS);
        }

        $teams = array();
        foreach ($team_obj as $team) {
            $teams[$team->id] = $team->name;
        }

        if (Input::has('team_id')) {
            $initial_team = Input::get('team_id');
        } else {
            $initial_team = Auth::user()->team_id;
        }

        return View::make('manage_users')
            ->with('team_array', $teams)
            ->with('initial_team', $initial_team);
    }

    public function manage_teams()
    {
        return View::make('manage_teams');
    }

    public function getAvailableTeams()
    {
        switch (Helper::managementStatus()) {
            case MANAGER:
                $team_obj = Team::where(function ($query) {
                    $query->where('team_leader_id', '=', Auth::user()->id)
                        ->orWhere('manager_id', '=', Auth::user()->id);
                })->get();
                break;
            case PRIMARY_CONTACT:
                $team_obj = Team::where('organisation_id', '=', Auth::user()->organisation_id)->get();
                break;
            default:
                return Helper::jsonLoader(UNAUTHORIZED_ACCESS);
        }

        $teams = array();
        foreach ($team_obj as $team) {
            $teams[$team->id] = $team->name;
        }

        return json_encode($teams);
    }

    public function getOrganisationTeams()
    {
        $team_obj = Team::where('organisation_id', '=', Auth::user()->organisation_id)->get();
        $teams = array();
        foreach ($team_obj as $team) {
            $teams[$team->id] = $team->name;
        }

        return json_encode(array('teams' => $teams, 'userteam' => Auth::user()->team_id));
    }

    public function getAllTeams()
    {
        $teams = Team::where('organisation_id', '=', Auth::user()->organisation_id)
            ->with(array('userRelatedByTeamLeaderId' => function ($query) {
                $query->with(array('organisation' => function ($query) {
                    $query->select(array('name'));
                }))
                    ->with('city')
                    ->with(array('payrate' => function ($query) {
                        $query->where('user_pay_rate.end_date', '=', null);
                    }));
            }))
            ->with(array('userRelatedByManagerId' => function ($query) {
                $query->with(array('organisation' => function ($query) {
                    $query->select(array('name'));
                }))
                    ->with('city')
                    ->with(array('payrate' => function ($query) {
                        $query->where('user_pay_rate.end_date', '=', null);
                    }));
            }))
            ->with(array('user' => function ($query) {
                $query->with(array('organisation' => function ($query) {
                    $query->select(array('name'));
                }))
                    ->with('city')
                    ->with(array('payrate' => function ($query) {
                        $query->where('user_pay_rate.end_date', '=', null);
                    }));
            }))
            ->get();

        return Helper::jsonLoader(SUCCESS, $teams->toArray());
    }

    public function getTeam()
    {
        if (Helper::managementStatus() == NOT_MANAGEMENT) return Helper::jsonLoader(UNAUTHORIZED_ACCESS);
        if (!Input::has('team_id')) return Helper::jsonLoader(INCORRECT_DATA);

        $team = Team::where(function ($query) {
            $query->where('id', '=', Input::get('team_id'));
            if (Helper::managementStatus() == PRIMARY_CONTACT)
                $query->whereOrganisationId(Auth::user()->organisation_id);
            if (Helper::managementStatus() == MANAGER)
                $query->where(function ($query) {
                    $query->where('team_leader_id', '=', Auth::user()->id)
                        ->orWhere('manager_id', '=', Auth::user()->id);
                });
        })
            ->with(array(
                'userRelatedByTeamLeaderId',
                'userRelatedByManagerId',
                'user' => function ($query) {
                    $query->where('team_id', '=', Input::get('team_id'))
                        ->with(array(
                            'city',
                            'role',
                            'organisation' => function ($query) {
                                $query->select(array('name'));
                            },
                            'payrate' => function ($query) {
                                $query->where('user_pay_rate.end_date', '=', null);
                            },
                            'billablerate' => function ($query) {
                                $query->where('user_billable_rate.end_date', '=', null);
                            }))
                        ->orderBy('first_name', 'asc');
                }
            ))
            ->first();

        $organisation_teams = Team::where('organisation_id', '=', Auth::user()->organisation_id)->get();

        if (empty($team)) return Helper::jsonLoader(TEAM_NOT_FOUND);

        return Helper::jsonLoader(SUCCESS, array('team' => $team->toArray(), 'organisation_teams' => $organisation_teams->toArray(), 'organisation' => Auth::user()->organisation));
    }

    public function postTeam()
    {
        if (Input::has('data')) {
            $input = Input::get('data');
            if (!is_array($input)) $input = json_decode($input, true);
        } else {
            return Helper::jsonLoader(INCORRECT_DATA);
        }
        if (isset($input['id']) && $input['id'] !== "") {
            $team = Team::whereId($input['id'])->whereOrganisationId(Auth::user()->organisation_id)->first();

        } else if (isset($input['name']) && $input['name'] != "undefined") {
            $team = Team::where('name', '=', $input['name'])->where('organisation_id', '=', Auth::user()->organisation_id)->first();

            if (!isset($team)) {
                $team = new Team;
                $team->organisation_id = Auth::user()->organisation_id;
                $team->name = $input['name'];
            }
        } else {
            return Helper::jsonLoader(INCORRECT_DATA);
        }

        if (isset($input['manager_id'])) {
            if ($input['manager_id'] != "")
                $team->manager_id = $input['manager_id'];
        }

        if (isset($input['team_leader_id'])) {
            if ($input['team_leader_id'] != "")
                $team->team_leader_id = $input['team_leader_id'];
        }
        if (isset($input['name']) && $input['name'] != "") {
            $team->name = $input['name'];
        }

        if (isset($input['description']) && $input['description'] != "") {
            $team->description = $input['description'];
        }

        $team->campaign_id = Campaign::whereOrganisationId(Auth::user()->organisation_id)->first()->id;

        try {
            $team->save();
        } catch (Exception $e) {
            return Helper::jsonLoader(EXCEPTION, $e->getMessage());
        }

        return Helper::jsonLoader(SUCCESS, array('team_id' => $team->id));

    }

    public function postDeleteTeam()
    {
        if (Input::has('data')) {
            $input = Input::get('data');
        } else {
            return Helper::jsonLoader(INCORRECT_DATA);
        }

        $team = Team::find($input['id']);

        if (count($team->user) == 0 && count($team->roster) == 0) {
            try {
                Team::destroy($input['id']);
            } catch (Exception $e) {
                return Helper::jsonLoader(EXCEPTION, $e->getMessage());
            }
        } else {
            $team->delete();
        }

        return (Helper::jsonLoader(SUCCESS));
    }

    public function deleteTeam()
    {
        if (!Input::has('id')) return Helper::jsonLoader(INCORRECT_DATA);

        $team = Team::find(Input::get('id'));
        if (count($team->user) != 0) {
            return (Helper::jsonLoader(TEAM_HAS_USER, $team->user));
        } else if (count($team->roster) != 0) {
            return (Helper::jsonLoader(TEAM_HAS_ROSTER, $team->roster));
        } else {
            try {
                $val = Team::destroy(Input::get('id'));
            } catch (Exception $e) {
                return Helper::jsonLoader(EXCEPTION, $e->getMessage());
            }
            return (Helper::jsonLoader(SUCCESS, $val));

        }
        return (Helper::jsonLoader(SUCCESS, $val));

    }
    public function editRosterTeam($team_id) {
        $rosters = Team::find($team_id)->roster;
        $teams = Team::where('organisation_id', '=', Auth::user()->organisation_id)->where('id', '<>', $team_id)->get();
        return View('manage_teams_edit_roster_team', ['rosters' => $rosters->toArray(), 'teams'=> $teams->toArray(), 'team_id'=> $team_id]);
    }
}

?>