<?php

class RemindersController extends Controller
{

    /**
     * Display the password reminder view.
     *
     * @return Response
     */
    public function getRemind()
    {
        return View::make('password.remind');
    }

    /**
     * Handle a POST request to remind a user of their password.
     *
     * @return Response
     */
    public function postRemind()
    {
        switch ($response = Password::sendResetLink(Input::only('email'), function ($message)
        {
            $message->subject('Password Reset');
        }))
        {
            case Password::INVALID_USER:
                return Redirect::back()->with('flash_error', Lang::get($response));

            case Password::RESET_LINK_SENT:
                return Redirect::to('login')->with('flash_notice', 'Password reminder has been sent. Please check your email.');
        }
    }

    public function postRemindajax()
    {
        switch ($response = Password::sendResetLink(Input::only('email'), function ($message)
        {
            $message->subject('Password Reset');
        }))
        {
            case Password::INVALID_USER:
                return json_encode(array('result' => '401', 'message' => 'invalid user'));

            case Password::RESET_LINK_SENT:
                return json_encode(array('result' => '0', 'message' => 'success'));
        }
    }

    /**
     * Display the password reset view for the given token.
     *
     * @param  string $token
     * @return Response
     */
    public function getReset($token = null)
    {
        if (is_null($token)) App::abort(404);

        if (!Input::has('email')) App::abort(404);

        return View::make('password.reset')->with('token', $token)->with('email', Input::get('email'));
    }

    public function getWelcome($token = null)
    {
        if (is_null($token)) App::abort(404);

        if (!Input::has('email')) App::abort(404);

        return View::make('password.welcome')->with('token', $token)->with('email', Input::get('email'));
    }

    /**
     * Handle a POST request to reset a user's password.
     *
     * @return Response
     */
    public function postReset()
    {
        $credentials = Input::only(
            'email', 'password', 'password_confirmation', 'token'
        );

        $response = Password::reset($credentials, function ($user, $password)
        {
            $user->password = Hash::make($password);

            $user->save();
        });

        switch ($response)
        {
            case Password::INVALID_PASSWORD:
            case Password::INVALID_TOKEN:
            case Password::INVALID_USER:
                return Redirect::back()->with('flash_error', Lang::get($response));

            case Password::PASSWORD_RESET:
                return Redirect::to('/')->with('flash_notice', 'Password has been reset.');
        }
    }

}