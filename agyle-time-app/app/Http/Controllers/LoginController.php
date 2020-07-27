<?php
use App\Helper\Helper;
use \App\Models\Roster\User;
class LoginController extends BaseController
{

    /*
     * Performs the actions to log a user in. Utilizes the Laravel security class.
    */
    public function getLogin()
    {
        return View::make('login');
    }

    public function postLogin()
    {
        $remember = Input::get('remember-me', false);

        $organisation_id = Organisation::where('subdomain', '=', Helper::getSubdomain())->first();
        if (!isset($organisation_id))
        {
            return Redirect::route('login')
                           ->with('flash_error', 'Your username/password does not exist in this company.')
                           ->withInput();
        }

        $organisation_id = $organisation_id->id;
        $user = User::where('email', '=', Input::get('email'))
                    ->where('organisation_id', '=', $organisation_id)
                    ->where('active', '=', true)
                    ->first();
        if (isset($user) && Hash::check(Input::get('password'), $user->password))
        {
            Auth::loginUsingId($user->id, $remember);
            if (Auth::check())
            {
                return Redirect::intended('/')
                               ->with('flash_notice', 'You are successfully logged in.');
            }
        }

        // authentication failure! lets go back to the login page
        return Redirect::back()
                       ->with('flash_error', 'Your username/password combination was incorrect.')
                       ->withInput();
    }

    /*
     * Logs a user out of the system.
     */

    public function logout()
    {
        Auth::logout();
        return Redirect::route('login')
                       ->with('flash_notice', 'You are successfully logged out.');
    }

    /*
     * Login for API using applications to be able to login as a specific user.
     */

    public function postApiUserLogin()
    {
        if (!Input::has(array('email', 'password', 'subdomain'))) return Helper::jsonLoader(INCORRECT_DATA);

        $input = Input::all();

        $organisation_id = Organisation::where('subdomain', '=', $input['subdomain'])->first();

        if (!isset($organisation_id)) return Helper::jsonLoader(DATA_NOT_FOUND);

        $organisation_id = $organisation_id->id;

        $user = User::where('email', '=', Input::get('email'))
                    ->where('organisation_id', '=', $organisation_id)
                    ->where('active', '=', true)
                    ->first();

        if (isset($user) && Hash::check(Input::get('password'), $user->password))
        {
            Auth::loginUsingId($user->id);
            if (Auth::check())
            {
                return Helper::jsonLoader(SUCCESS, array('session_id' => Session::getId(), 'session_handler' => 'laravel_session'));
            }
        }

        return Helper::jsonLoader(DATA_NOT_FOUND);
    }
}

?>