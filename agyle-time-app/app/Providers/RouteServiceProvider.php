<?php namespace App\Providers;

use Illuminate\Routing\Router;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use App\Helper\Helper;
use App\Models\Roster;
class RouteServiceProvider extends ServiceProvider {
	/**
	 * This namespace is applied to the controller routes in your routes file.
	 *
	 * In addition, it is set as the URL generator's root namespace.
	 *
	 * @var string
	 */
	protected $namespace = null;

	/**
	 * Define your route model bindings, pattern filters, etc.
	 *
	 * @param  \Illuminate\Routing\Router  $router
	 * @return void
	 */
	public function boot(Router $router)
	{
		parent::boot($router);
		/*
        |--------------------------------------------------------------------------
        | Authentication Filters
        |--------------------------------------------------------------------------
        |
        | The following filters are used to verify that the user of the current
        | session is logged into this application. The "basic" filter easily
        | integrates HTTP Basic authentication for quick, simple checking.
        |
        */

		Route::filter('auth', function()
		{
			if (Auth::guest()) {
				if(Route::currentRouteName() == 'home') {
					return Redirect::guest('login');
				}
				return Redirect::guest('login')
					->with('flash_error', 'You must be logged in to view this page!');
			}

		});


		Route::filter('auth.basic', function()
		{
			return Auth::basic();
		});

		Route::filter('api_auth', function()
		{
			if(Auth::guest())
			{
				if(Input::has('organisation'))
				{
					$organisation = Organisation::find(Input::get('organisation'));
					if(isset($organisation))
					{
						if($organisation->api_token != Input::get('api_token') || $organisation->plan_id != 1)
						{
							return Helper::jsonLoader(UNAUTHORIZED_ACCESS);
						}
					} else
					{
						return Helper::jsonLoader(UNAUTHORIZED_ACCESS);
					}
					$user = User::where('organisation_id', '=', $organisation->id)->where('primary_contact', '=', true)->first();

					Auth::loginUsingId($user->id);
				} else
				{
					return Helper::jsonLoader(UNAUTHORIZED_ACCESS);
				}
			}
		});

		Route::filter('management', function()
		{
			switch(Helper::managementStatus())
			{
				case MANAGER:
					break;
				case PRIMARY_CONTACT:
					break;
				default:
					return Redirect::route('home')
						->with('flash_error', 'You must be logged in as a manager to view this page!');
			}
		});

		Route::filter('administrator', function()
		{
			if(Helper::managementStatus() != PRIMARY_CONTACT)
			{
				return Redirect::route('home')
					->with('flash_error', 'You must be logged in as an administrator to view this page!');
			}
		});

		/*
        |--------------------------------------------------------------------------
        | Guest Filter
        |--------------------------------------------------------------------------
        |
        | The "guest" filter is the counterpart of the authentication filters as
        | it simply checks that the current user is not logged in. A redirect
        | response will be issued if they are, which you may freely change.
        |
        */

		Route::filter('guest', function()
		{
			if (Auth::check())
				return Redirect::route('home')
					->with('flash_notice', 'You are already logged in!');
		});

		Route::filter('force-guest', function()
		{
			if(Auth::check())
				Auth::logout();
		});

		/*
        |--------------------------------------------------------------------------
        | CSRF Protection Filter
        |--------------------------------------------------------------------------
        |
        | The CSRF filter is responsible for protecting your application against
        | cross-site request forgery attacks. If this special token in a user
        | session does not match the one given in this request, we'll bail.
        |
        */

		Route::filter('csrf', function()
		{
			if (Session::token() != Input::get('_token'))
			{
//				throw new Illuminate\Support\Facades\Session\TokenMismatchException;
			}
		});

		/*
         * View Composers
         */

		View::composer('partials/navbar', function($view)
		{
			$gravatar =  "//www.gravatar.com/avatar/" . md5( strtolower( trim( Auth::user()->email ) ) ) . "?s=30&d=mm";

			$view
				->with('user', \App\Models\Roster\User::find((Auth::user()->id)))
				->with('messages', \Message::where('recipient_id', '=', 1)->get())
				->with('notifications', \Message::where('recipient_id', '=', 1)->get())
				->with('gravatar', $gravatar);
		});

		View::composer('partials/sidebar', function($view)
		{
			$view
				->with('leadteams', \Team::where('team_leader_id', '=', Auth::user()->id)->get())
				->with('managedteams', \Team::where('manager_id', '=', Auth::user()->id)->get());
		});

		/*
         * Redirect any Primary user who hasn't completed setup wizard to complete it.
         */

		Route::filter('force-setup-wizard', function() {
			if(Auth::check())
			{
				$organisation = Auth::user()->organisation;

				if(Route::getCurrentRoute()->getPath() != 'setup_wizard' && Auth::user()->primary_contact == true && $organisation->setup_wizard_complete == false)
				{
					return Redirect::route('setup_wizard')
						->with('flash_error', 'Please complete the setup wizard');
				}
			}
		});

		/*
        |--------------------------------------------------------------------------
        | Force Https requests
        |--------------------------------------------------------------------------
        */

		Route::filter('force.ssl', function()
		{
			if(!Helper::isSecure() && Config::get('app.ssl_enabled')) // change local with the name of your local environment
			{
				return Redirect::secure(Request::getRequestUri());
			}
		});
		//
	}

	/**
	 * Define the routes for the application.
	 *
	 * @param  \Illuminate\Routing\Router  $router
	 * @return void
	 */
	public function map(Router $router)
	{
		$router->group(['namespace' => $this->namespace], function($router)
		{
			require app_path('Http/routes.php');
		});
	}

}
