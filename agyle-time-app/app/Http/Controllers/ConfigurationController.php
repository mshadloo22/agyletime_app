<?php
use \App\Helper\Helper;

class ConfigurationController extends BaseController
{

    public function __construct()
    {
        $this->beforeFilter('api_auth');
    }

    public function get_configuration_page()
    {
        return View::make('configure_organisation');
    }

    public function getConfigurations()
    {
        if (!Input::has('object_type', 'object_id', 'config_group'))
            return Helper::jsonLoader(INCORRECT_DATA);

        $input = Input::all();

        $config = new ConfigGenerator($input['object_type'], $input['object_id']);

        $config->getConfigGroup($input['config_group']);
    }
}