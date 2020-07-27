<?php
use \App\Helper\Helper;
use \App\Models\Roster\User;

define("XRO_APP_TYPE", "Public");
define("OAUTH_CALLBACK", 'http://beta.agyletime.com/xero/timesheets-to-xero');
define('BASE_PATH', dirname(__FILE__) . '/../lib/Xero/');
define('PAYROLL_ADDRESS', 'https://api.xero.com/payroll.xro/1.0/');
define('ACCOUNTS_ADDRESS', 'https://api.xero.com/api.xro/2.0/');

/* Requires PECL Oauth Lib. PHP 5.5 comes pre-installed, if not installed run pecl install oauth, in theory anyway ;) #gotohellxerooauth */
class XeroController extends BaseController
{

    public function __construct()
    {
        $this->beforeFilter('api_auth');
    }

    public function postOAuthUrl()
    {
        $config = $this->xeroConfiguration();

        if(Input::has('data'))
        {
            $data = json_decode(Input::get('data'), true);
        }

        if(isset($data['timesheets']) && count($data['timesheets']) > 0)
        {
            Session::put('timesheets_for_xero', $data['timesheets']);
        }

        if(isset($data['invoices']) && count($data['invoices']) > 0)
        {
            Session::put('invoices_for_xero', $data['invoices']);
        }

        $subdomain = Helper::getSubdomain();

        if(isset($data['callback']))
        {
            if($subdomain == 'app' || $subdomain == 'beta')
            {
                $callback_uri = "http://$subdomain.agyletime.com/xero/$data[callback]";
            } else
            {
                $callback_uri = "http://$subdomain.agyletime.net/xero/$data[callback]";
            }
        } else
        {
            return Helper::jsonLoader(INCORRECT_DATA);
        }

        $oauth = new OAuth($config['conskey'], $config['conssec'], OAUTH_SIG_METHOD_HMACSHA1, OAUTH_AUTH_TYPE_URI);

        if(App::environment('local'))
            $oauth->disableSSLChecks();

        $request_token_info = $oauth->getRequestToken($config['req_url'], $callback_uri);

        Session::put('secret', $request_token_info['oauth_token_secret']);

        $scope = $this->xeroScope($data['callback']);

        $uri = $config['authurl'] . '?oauth_token=' . rawurlencode($request_token_info['oauth_token']);

        if($scope !== '') $uri = $uri . '&scope=' . rawurlencode($scope);

        return json_encode(array('url' => $uri));
    }

    public function getTimesheetsToXero()
    {
        $oauth = $this->authenticate();

        if(Session::has('timesheets_for_xero')) {
            $timesheet_ids = Session::get('timesheets_for_xero');


            $teams = Team::whereHas('user', function($query) use ($timesheet_ids){
                $query->whereHas('timesheet', function($query) use ($timesheet_ids) {
                    $query->whereIn('id', $timesheet_ids);
                });
            })
                         ->with(array('user' => function($query) use ($timesheet_ids){
                             $query->whereHas('timesheet', function($query) use ($timesheet_ids) {
                                 $query->whereIn('id', $timesheet_ids);
                             })
                                   ->with(array('timesheet' => function($query) use ($timesheet_ids) {
                                       $query->whereIn('id', $timesheet_ids)
                                             ->with('timesheetshift.timesheetbreak');
                                   }));
                         }))
                         ->get();

            $xml = $this->prepareTimesheetsXML('Fortnight', $teams);

            try
            {
                $success = $oauth->fetch(PAYROLL_ADDRESS . 'Timesheets', array('xml' => $xml->asXML()), 'POST', array('Accept' => 'application/json', 'Content-Type' => 'application/x-www-form-urlencoded', 'Encoding' => 'UTF-8'));
            } catch (Exception $e)
            {
                echo "<pre>";
                var_dump($e->getMessage());
                echo "</pre>";
            }

            $response = json_decode($oauth->getLastResponse(), true);

            if(isset($response['Status']) && $response['Status'] == "OK")
            {
                TimesheetIntegration::whereIn('timesheet_id', $timesheet_ids)->update(array('sent' => true));
            }

            return Redirect::route('approve_timesheet');
        }

        return Redirect::route('approve_timesheet')
                       ->with('flash_error', 'No Timesheets selected.');
    }

    public function getInvoicesToXero()
    {
        $oauth = $this->authenticate();

        if(Session::has('invoices_for_xero')) {
            $invoice_ids = Session::get('invoices_for_xero');


            $invoices = Invoice::where(function($query) use ($invoice_ids) {
                $query->where('organisation_id', '=', Auth::user()->organisation_id)
                      ->whereIn('id', $invoice_ids);

            }   )
                               ->with('invoicetemplate.invoicecalendar')
                               ->with('invoiceitem.billablerate')
                               ->get();

            $xml = XeroXmlGenerator::prepareInvoicesXML($invoices);

            try
            {
                $success = $oauth->fetch(ACCOUNTS_ADDRESS . 'Invoices', array('xml' => $xml->asXML()), 'POST', array('Accept' => 'application/json', 'Content-Type' => 'application/x-www-form-urlencoded', 'Encoding' => 'UTF-8'));
            } catch (Exception $e)
            {
                echo "<pre>";
                var_dump($e->getMessage());
                echo "</pre>";
            }

            echo "<pre>";
            var_dump($oauth->getLastResponse());
            echo "</pre>";
            exit;

            $response = json_decode($oauth->getLastResponse(), true);

            if(isset($response['Status']) && $response['Status'] == "OK")
            {
                Invoice::whereIn('id', $invoice_ids)->update(array('sent' => true));
            }

            return Redirect::route('invoices');
        }

        return Redirect::route('invoices')
                       ->with('flash_error', 'No Invoices selected.');
    }

    public function getXeroEmployees()
    {
        $oauth = $this->authenticate();

        try
        {
            $success = $oauth->fetch(PAYROLL_ADDRESS . 'Employees', array(), 'GET', array('Accept' => 'application/json'));
        }
        catch(Exception $e)
        {
            echo "<pre>";
            var_dump($e->getMessage());
            echo "</pre>";
        }

        $response = json_decode($oauth->getLastResponse(), true);

        foreach($response['Employees'] as $user)
        {
            $user_model = User::where('email', '=', $user['Email'])
                              ->where('organisation_id', '=', Auth::user()->organisation_id)
                              ->with(array('integration' => function ($query) {
                                  $query->where('name', '=', 'Xero');
                              }))->first();

            if(isset($user_model, $user['OrdinaryEarningsRateID']))
            {
				if(isset($user->integrations[0])) $config_array = json_decode($user->integrations[0]->pivot->configuration,true);
                else $config_array = [];
                $config_array["SaturdayRate"] = ["EarningsRateID" => "fe59d27f-4da0-4c71-8e5b-7ce6bf276ea6"];
                $config_array["SundayRate"] = ["EarningsRateID" => "168cc65e-0fd6-4def-b4d4-b4ce9b8443a4"];
                $config_array['EmployeeID'] = $user['EmployeeID'];
                $config_array['OrdinaryEarningsRateID'] = $user['OrdinaryEarningsRateID'];
                $config_array = json_encode($config_array);
                if(isset($user_model->integration[0])) {
                    $user_model->integration()->updateExistingPivot(1, ['configuration' => $config_array]);
                } else {
                    $user_model->integration()->attach(1, ['configuration' => $config_array]);
                }
            } else
            {
                $failures[] = $user;
            }
        }

        $this->getEarningsRates($oauth);

        return Redirect::to('organisation_profile')->with('flash_notice', 'Users have been synced with Xero successfully');
    }

    public function getInvoiceConfigFromXero()
    {
        $oauth = $this->authenticate();

        $org_integration = OrganisationIntegration::where('organisation_id', '=', Auth::user()->id)
                                                  ->where('integration_id', '=', 1)
                                                  ->first();
        $endpoints = ['BrandingThemes', 'TrackingCategories', 'TaxRates', 'Contacts', 'Accounts'];

        if(count($response = XeroXmlGenerator::getConfigs($oauth, $endpoints, $org_integration->id)) == 0)
        {
            return Redirect::route('home')
                           ->with('flash_notice', 'Xero Configuration options have been updated.');
        } else
        {
            $errors = "";
            foreach($response as $code => $message)
            {
                $errors = "$errors<p>$code: $message</p>";
            }
            return Redirect::route('home')
                           ->with('flash_error', "<p>The following errors occurred:</p>$errors");
        }
    }

    public function postNewIntegration()
    {
        if(Input::has('integration_id'))
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
        } catch(Exception $e)
        {
            return Helper::jsonLoader(EXCEPTION, $e->getMessage());
        }

        return Helper::jsonLoader(SUCCESS);
    }

    public function postRemoveIntegration()
    {
        if(Input::has('integration_id') )
        {
            $integration_id = Input::get('integration_id');
        } else {
            return Helper::jsonLoader(INCORRECT_DATA);
        }

        try
        {
            $organisation = Organisation::find(Auth::user()->organisation_id);
            $organisation->integration()->detach($integration_id);
        } catch(Exception $e)
        {
            return Helper::jsonLoader(EXCEPTION, $e->getMessage());
        }

        return Helper::jsonLoader(SUCCESS);
    }

    private function xeroConfiguration()
    {
        $configuration = Integration::where('name','=','Xero')->first();

        $configuration = json_decode($configuration->configuration, true);

        return $configuration;
    }

    private function getEarningsRates($oauth)
    {
        try
        {
            $success = $oauth->fetch(PAYROLL_ADDRESS . 'PayItems', array(), 'GET', array('Accept' => 'application/json'));
        }
        catch(Exception $e)
        {
            echo "<pre>";
            var_dump($e->getMessage());
            echo "</pre>";
        }

        $response = json_decode($oauth->getLastResponse(), true);
        $config_array = [];
        if(isset($response['EarningsRates']))
        {
            foreach($response['EarningsRates'] as $earnings_rate)
            {
                $config_array[] = ['EarningsRateID' => $earnings_rate['EarningsRateID'], 'Name' => $earnings_rate['Name']];
            }

            $this->updateOrgXeroSettings('EarningsRates', $config_array);
        }
    }

    private function updateOrgXeroSettings($index, $new_config)
    {
        $organisation = Organisation::find(Auth::user()->organisation_id);

        $org_config = json_decode($organisation->integration[0]->pivot->configuration, true);

        $org_config[$index] = $new_config;

        $organisation->integration[0]->pivot->configuration = json_encode($org_config);
        $organisation->integration[0]->pivot->save();
    }

    private function authenticate()
    {
        $config = $this->xeroConfiguration();

        $oauth = new OAuth($config['conskey'], $config['conssec'], OAUTH_SIG_METHOD_HMACSHA1, OAUTH_AUTH_TYPE_URI);
        $oauth->disableSSLChecks();

        try
        {
            $oauth->setToken(Input::get('oauth_token'), Session::get('secret'));
            $access_token_info = $oauth->getAccessToken($config['acc_url']);
            Session::put('access_token', $access_token_info['oauth_token']);
            Session::put('access_token_secret', $access_token_info['oauth_token_secret']);
        } catch (Exception $e)
        {
            echo "<pre>";
            $e->getMessage();
            echo "</pre>";
        }

        $oauth_request = new Oauth($config['conskey'], $config['conssec'], OAUTH_SIG_METHOD_HMACSHA1, OAUTH_AUTH_TYPE_URI);
        if(App::environment('local'))
            $oauth_request->disableSSLChecks();

        try
        {
            $oauth_request->setToken(Session::get('access_token'), Session::get('access_token_secret'));;
        } catch (Exception $e)
        {
            var_dump($e);
        }

        return $oauth_request;
    }

    private function prepareTimesheetsXML($pay_period, $teams)
    {
        $xml = new SimpleXMLElement('<Timesheets></Timesheets>');

        switch($pay_period) {
            case 'Fortnight':
                return XeroXmlGenerator::timesheetPostXML($xml, $teams);
            default:
                return XeroXmlGenerator::timesheetPostXML($xml, $teams);
        }
    }

    private function xeroScope($callback)
    {
        switch($callback)
        {
            case 'Employees':
                return 'payroll.employees';
            case 'Timesheets':
                return 'payroll.payruns,payroll.timesheets';
            default:
                return 'payroll.employees,payroll.payruns,payroll.timesheets';
        }
    }
}

?>