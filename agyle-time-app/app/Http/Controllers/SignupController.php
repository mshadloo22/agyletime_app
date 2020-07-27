<?php
use \App\Helper\Helper;
use \App\Models\Roster\User;
class SignupController extends BaseController
{

    /*
     * Performs the actions to log a user in. Utilizes the Laravel security class.
    */
    public function getSignup()
    {
        return View::make('sign_up');
    }

    public function postSignup()
    {
        $input = Input::all();

        try
        {
            $organisation = new Organisation;
            $organisation->name = $input['subdomain'];
            $organisation->subdomain = $input['subdomain'];
            $organisation->api_token = Helper::randomString();
            $organisation->plan_id = 1;
            $organisation->payment_info_id = 1;
            $organisation->save();
            $user = new User;
            $user->email = $input['email'];
            $user->password = Hash::make($input['password']);
            $user->organisation_id = '1';
            $user->site_id = 1;
            $user->notification_preference_id = 1;
            $user->message_notification_id = 1;
            $user->active = true;
            $user->site_id = '1';//This broke the signup process as Auth:user() doesn't exist yet.
            $user->primary_contact = true;
            $user->timezone = 1;
            $user->save();

        } catch (Exception $e)
        {
            return Redirect::route('signup')
                           ->with('flash_error', 'Signup Error: ' . $e->getMessage())
                           ->withInput();
        }

        Auth::login($user);

        return Redirect::route('setup_wizard')
                       ->with('flash_notice', 'Account created.');

    }
}

?>