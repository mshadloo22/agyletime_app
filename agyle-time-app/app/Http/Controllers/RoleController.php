<?php
use \App\Models\Roster\User;
use \App\Helper\Helper;
class RoleController extends BaseController
{
    public function __construct()
    {
        $this->beforeFilter('api_auth');
    }

    public function manage_roles()
    {
        return View::make('manage_roles');
    }

    public function getAvailableRoles()
    {
        switch (Helper::managementStatus())
        {
            case MANAGER:
                $role_obj = Role::where('organisation_id', '=', Auth::user()->organisation_id)->get();
                break;
            case PRIMARY_CONTACT:
                $role_obj = Role::where('organisation_id', '=', Auth::user()->organisation_id)->get();
                break;
            default:
                return Helper::jsonLoader(UNAUTHORIZED_ACCESS);
        }

        $roles = array();
        foreach ($role_obj as $role)
        {
            $roles[$role->id] = $role->name;
        }

        return Helper::jsonLoader(SUCCESS, $roles);
    }

    public function getOrganisationRoles()
    {
        $role_obj = Role::where('organisation_id', '=', Auth::user()->organisation_id)->get();

        if (Input::has('array'))
        {
            $roles = array();
            foreach ($role_obj as $role)
            {
                $roles[$role->id] = $role->name;
            }
            return Helper::jsonLoader(SUCCESS, $roles);
        } else
        {
            return Helper::jsonLoader(SUCCESS, $role_obj->toArray());
        }
    }

    public function postRole()
    {
        If (Input::has('role'))
        {
            $input = Input::get('role');
        } else
        {
            return Helper::jsonLoader(INCORRECT_DATA);
        }
        try
        {
            if (isset($input['id']))
            {
                $role = Role::where('id', '=', $input['id'])
                            ->where('organisation_id', '=', Auth::user()->organisation_id)
                            ->first();

                if (isset($input['name']))
                    $role->name = $input['name'];
            } else
            {
                $role = Role::firstOrCreate(array('name' => $input['name'], 'organisation_id' => Auth::user()->organisation_id));
            }

            if (isset($input['description']))
                $role->description = $input['description'];

            $role->save();
        } catch (Exception $e)
        {
            return Helper::jsonLoader(EXCEPTION, ['exception' => $e->getMessage()]);
        }

        return Helper::jsonLoader(SUCCESS);
    }

    public function postRoles()
    {
        $inputArray = Input::all();
        $inputArray = json_decode($inputArray['data'], true);

        foreach ($inputArray as $input)
        {
            try
            {
                if (isset($input['id']))
                {
                    $role = Role::where('id', '=', $input['id'])
                                ->where('organisation_id', '=', Auth::user()->organisation_id)
                                ->first();

                    if (isset($input['name']))
                        $role->name = $input['name'];
                } else
                {
                    $role = Role::firstOrCreate(array('name' => $input['name'], 'organisation_id' => Auth::user()->organisation_id));
                }

                if (isset($input['description']))
                    $role->description = $input['description'];

                $role->save();
            } catch (Exception $e)
            {
                return Helper::jsonLoader(EXCEPTION, ['file' => $e->getFile(), 'line' => $e->getLine(), 'message' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            }
        }

        return Helper::jsonLoader(SUCCESS);
    }
}