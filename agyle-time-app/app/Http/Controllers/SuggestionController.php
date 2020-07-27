<?php

class SuggestionController extends BaseController
{
    public function postSuggestion()
    {
        $data = Input::all();
        $data['first_name'] = Auth::user()->first_name;
        $data['last_name'] = Auth::user()->last_name;

        Mail::send('emails.suggestion', $data, function ($message) use ($data)
        {
            $message->to('ideas@agyletime.com', 'Ideas')->from(Auth::user()->email, $data['first_name'] . " " . $data['last_name'])->subject('Suggestion/Error');
        });
        return Redirect::back();

    }
}

?>