<?php
use \App\Helper\Helper;

class AdherenceController extends BaseController
{
    public function __construct()
    {
        $this->beforeFilter('api_auth');
    }

    public function postException()
    {
        if (!(Input::has('rostered_shift_id') || Input::has('id'))) return Helper::jsonLoader(INCORRECT_DATA);

        if (Input::has('id'))
        {
            $adherence_exception = AdherenceException::whereId(Input::get('id'))
                                                     ->whereOrganisationId(Auth::user()->organisation_id)->first();
            if (Input::has('start_time')) $adherence_exception->start_time = Input::get('start_time');
            if (Input::has('end_time')) $adherence_exception->end_time = Input::get('end_time');
            if (Input::has('notes')) $adherence_exception->notes = Input::get('notes');
        } else
        {
            $adherence_exception = new AdherenceException;
        }

        if ($adherence_exception->save())
        {
            return Helper::jsonLoader(SUCCESS);
        } else
        {
            return Helper::jsonLoader(INCORRECT_DATA, $adherence_exception->errors()->all());
        }
    }

}

?>