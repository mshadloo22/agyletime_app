<?php
use \App\Helper\Helper;

class EmploymentRulesController extends BaseController
{
    public function __construct()
    {
        $this->beforeFilter('api_auth');
    }

    public function employment_rules_template()
    {
        return View::make('employment_rules');
    }

    public function getTemplate()
    {
        if (Input::has('employment_rules_template_id'))
        {
            $template = EmploymentRulesTemplate::whereId(Input::get('employment_rules_template_id'))
                                               ->whereOrganisationId(Auth::user()->id)
                                               ->get();
        } else
        {
            $template = EmploymentRulesTemplate::whereOrganisationId(Auth::user()->id)
                                               ->get();
        }

        return Helper::jsonLoader(SUCCESS, $template->toArray());
    }

    public function postTemplate()
    {
        $input = Input::json()->all();
        if (isset($input['id']))
        {
            $template = EmploymentRulesTemplate::find($input['id']);
        } else
        {
            $template = new EmploymentRulesTemplate;
            $template->organisation_id = Auth::user()->organisation_id;
        }

        $template->fill($input);

        if (!$template->save())
        {
            return Helper::jsonLoader(INCORRECT_DATA, $template->errors()->all());
        } else
        {
            return Helper::jsonLoader(SUCCESS, ['id' => $template->id]);
        }
    }

    public function deleteTemplate()
    {
        if (Input::has('id'))
            EmploymentRulesTemplate::destroy(Input::get('id'));
    }
}