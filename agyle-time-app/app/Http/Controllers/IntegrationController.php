<?php
use \App\Helper\Helper;

class IntegrationController extends BaseController
{

    public function __construct()
    {
        $this->beforeFilter('api_auth');
    }

    public function postNewIntegration()
    {
        if (Input::has('integration_id'))
        {
            $integration_id = Input::get('integration_id');
        } else
        {
            return Helper::jsonLoader(INCORRECT_DATA);
        }

        try
        {
            $organisation = Organisation::find(Auth::user()->organisation_id);
            $organisation->integration()->attach($integration_id);
        } catch (Exception $e)
        {
            return Helper::jsonLoader(EXCEPTION, $e->getMessage());
        }

        return Helper::jsonLoader(SUCCESS);
    }

    public function postRemoveIntegration()
    {
        if (Input::has('integration_id'))
        {
            $integration_id = Input::get('integration_id');
        } else
        {
            return Helper::jsonLoader(INCORRECT_DATA);
        }

        try
        {
            $organisation = Organisation::find(Auth::user()->organisation_id);
            $organisation->integration()->detach($integration_id);
        } catch (Exception $e)
        {
            return Helper::jsonLoader(EXCEPTION, $e->getMessage());
        }

        return Helper::jsonLoader(SUCCESS);
    }

    public function getUserIntegration()
    {
        if (!Input::has('user_id', 'integration_id')) return Helper::jsonLoader(INCORRECT_DATA);

        $user_integration = UserIntegration::firstOrNew(
            array(
                'user_id' => Input::get('user_id'),
                'integration_id' => Input::get('integration_id')
            )
        );

        if (!isset($user_integration->configuration))
        {
            $user_integration->configuration = $this->blankUserConfiguration(Input::get('integration_id'));
            $user_integration->save();
        }


        $integration = Integration::whereId(Input::get('integration_id'))
                                  ->with(array('user' => function ($query)
                                  {
                                      $query->where('user.id', '=', Input::get('user_id'));
                                  }))
                                  ->first();

        return Helper::jsonLoader(SUCCESS, $integration->toArray());
    }

    public function postUserIntegration()
    {
        $input = Input::json()->all();

        if (!isset($input['id'], $input['user_id'])) return Helper::jsonLoader(INCORRECT_DATA);

        try
        {
            Integration::find($input['id'])->user()->updateExistingPivot(
                $input['user_id'], array(
                    'configuration' => json_encode($input['user_configuration'])
                )
            );
        } catch (Exception $e)
        {
            return Helper::jsonLoader(EXCEPTION, ['message' => $e->getMessage()]);
        }

        return Helper::jsonLoader(SUCCESS);
    }

    private function blankUserConfiguration($integration_id)
    {
        $configuration = json_decode(Integration::find($integration_id)->configuration, true);
        $config_obj = [];

        if (isset($configuration['user_configurations']))
        {
            foreach ($configuration['user_configurations'] as $key => $val)
            {
                $config_obj[$val] = "";
            }
        }

        return json_encode($config_obj);
    }
}