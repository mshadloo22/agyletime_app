<?php
use \App\Helper\Helper;

define("SF_CLIENT_ID", "3MVG9Nvmjd9lcjRkoo0zey7ybc6vJiwiPMpqva2Bprat8vmaN3obwCCo7iUOJaMrC6hyDdBjO_O1SmhBnvto8");

define("SF_CLIENT_SECRET", "514274310205144691");

define("SF_REDIRECT_URI", "https://dev.agyletime.net/salesforce/oauth-callback");

define("SF_LOGIN_URI", "https://test.salesforce.com");

class SalesforceController extends BaseController
{

    private $auth_url;

    public function __construct()
    {
        $this->beforeFilter('api_auth');

        $this->auth_url = SF_LOGIN_URI
            . "/services/oauth2/authorize?response_type=code&client_id="
            . SF_CLIENT_ID . "&redirect_uri=" . urlencode(SF_REDIRECT_URI);
    }

    public function authenticate($function)
    {
        $configs = $this->getOrgConfig();

        if(!is_null($configs) && isset($configs['refresh_token']))
        {
            return $this->refreshToken($configs['refresh_token']);
        } else
        {
            Session::put('api_function', $function);
            return Helper::jsonLoader(SUCCESS, ['url' => $this->auth_url]);
        }
    }

    private function refreshToken($refresh_token)
    {
        $token_url = SF_LOGIN_URI . "/services/oauth2/token";
        $params = "&grant_type=refresh_token"
            . "&client_id=" . SF_CLIENT_ID
            . "&client_secret=" . SF_CLIENT_SECRET
            . "&refresh_token=" . $refresh_token;

        $curl = curl_init($token_url);
        curl_setopt($curl, CURLOPT_HEADER, false);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_POST, true);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $params);

        return $this->curlAuthExec($curl);
    }

    public function getOauthCallback()
    {
        $token_url = SF_LOGIN_URI . "/services/oauth2/token";

        $code = Request::get('code');
        $api_function = Session::get('api_function');

        if (!isset($code) || $code == "")
        {
            die("Error - code parameter missing from request!");
        }

        $params = "code=" . $code
            . "&grant_type=authorization_code"
            . "&client_id=" . SF_CLIENT_ID
            . "&client_secret=" . SF_CLIENT_SECRET
            . "&redirect_uri=" . urlencode(SF_REDIRECT_URI);

        $curl = curl_init($token_url);
        curl_setopt($curl, CURLOPT_HEADER, false);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_POST, true);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $params);

        if(($auth_return = $this->curlAuthExec($curl)) !== true)
        {
            return $auth_return;
        };

        return $this->$api_function();
    }

    public function getAccounts() {
        if(($auth_return = $this->authenticate('getAccounts')) !== true)
        {
            return $auth_return;
        };

        $access_token = Session::get('access_token');
        $instance_url = Session::get('instance_url');

        $query = "SELECT Name, Id from Account LIMIT 100";
        $url = "$instance_url/services/data/v20.0/query?q=" . urlencode($query);

        $curl = curl_init($url);
        curl_setopt($curl, CURLOPT_HEADER, false);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_HTTPHEADER,
            array("Authorization: OAuth $access_token"));

        $json_response = curl_exec($curl);
        $status = curl_getinfo($curl, CURLINFO_HTTP_CODE);

        if ( $status != 200 ) {
            return Helper::jsonLoader(EXCEPTION, "Error: call to URL $url failed with status $status, curl_error " . curl_error($curl) . ", curl_errno " . curl_errno($curl));
        }
        $response = json_decode($json_response, true);
        curl_close($curl);

        return Helper::jsonLoader(SUCCESS, $response);
    }

    function getAccount($id) {
        if(($auth_return = $this->authenticate('getAccount')) !== true)
        {
            return $auth_return;
        };

        $access_token = Session::get('access_token');
        $instance_url = Session::get('instance_url');

        $url = "$instance_url/services/data/v20.0/sobjects/Account/$id";

        $curl = curl_init($url);
        curl_setopt($curl, CURLOPT_HEADER, false);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_HTTPHEADER,
            array("Authorization: OAuth $access_token"));

        $json_response = curl_exec($curl);

        $status = curl_getinfo($curl, CURLINFO_HTTP_CODE);

        if ( $status != 200 ) {
            return Helper::jsonLoader(EXCEPTION, "Error: call to URL $url failed with status $status, curl_error " . curl_error($curl) . ", curl_errno " . curl_errno($curl));
        }
        $response = json_decode($json_response, true);
        curl_close($curl);

        return Helper::jsonLoader(SUCCESS, $response);
    }

    function getUpdateAccount($id, $new_name, $city) {
        if(($auth_return = $this->authenticate('getUpdateAccount')) !== true)
        {
            return $auth_return;
        };

        $access_token = Session::get('access_token');
        $instance_url = Session::get('instance_url');

        $url = "$instance_url/services/data/v20.0/sobjects/Account/$id";

        $content = json_encode(array("Name" => $new_name, "BillingCity" => $city));

        $curl = curl_init($url);
        curl_setopt($curl, CURLOPT_HEADER, false);
        curl_setopt($curl, CURLOPT_HTTPHEADER,
            array("Authorization: OAuth $access_token",
                "Content-type: application/json"));
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "PATCH");
        curl_setopt($curl, CURLOPT_POSTFIELDS, $content);

        curl_exec($curl);

        $status = curl_getinfo($curl, CURLINFO_HTTP_CODE);

        if ( $status != 204 ) {
            return Helper::jsonLoader(EXCEPTION, "Error: call to URL $url failed with status $status, curl_error " . curl_error($curl) . ", curl_errno " . curl_errno($curl));
        }

        curl_close($curl);

        return Helper::jsonLoader(SUCCESS, $status);
    }

    function getDeleteAccount($id) {
        if(($auth_return = $this->authenticate('getDeleteAccount')) !== true)
        {
            return $auth_return;
        };

        $access_token = Session::get('access_token');
        $instance_url = Session::get('instance_url');

        $url = "$instance_url/services/data/v20.0/sobjects/Account/$id";

        $curl = curl_init($url);
        curl_setopt($curl, CURLOPT_HEADER, false);
        curl_setopt($curl, CURLOPT_HTTPHEADER,
            array("Authorization: OAuth $access_token"));
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "DELETE");

        curl_exec($curl);

        $status = curl_getinfo($curl, CURLINFO_HTTP_CODE);

        if ( $status != 204 ) {
            return Helper::jsonLoader(EXCEPTION, "Error: call to URL $url failed with status $status, curl_error " . curl_error($curl) . ", curl_errno " . curl_errno($curl));
        }

        curl_close($curl);

        return Helper::jsonLoader(SUCCESS, $status);
    }

    function getCreateAccount($name) {
        if(($auth_return = $this->authenticate('getCreateAccount')) !== true)
        {
            return $auth_return;
        };

        $access_token = Session::get('access_token');
        $instance_url = Session::get('instance_url');

        $url = "$instance_url/services/data/v20.0/sobjects/Account/";

        $content = json_encode(array("Name" => $name));

        $curl = curl_init($url);
        curl_setopt($curl, CURLOPT_HEADER, false);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_HTTPHEADER,
            array("Authorization: OAuth $access_token",
                "Content-type: application/json"));
        curl_setopt($curl, CURLOPT_POST, true);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $content);

        $json_response = curl_exec($curl);

        $status = curl_getinfo($curl, CURLINFO_HTTP_CODE);

        if ( $status != 201 ) {
            return Helper::jsonLoader(EXCEPTION, "Error: call to URL $url failed with status $status, curl_error " . curl_error($curl) . ", curl_errno " . curl_errno($curl));
        }

        curl_close($curl);

        return Helper::jsonLoader(SUCCESS, json_decode($json_response,true));
    }


    private function curlAuthExec($curl)
    {
        $json_response = curl_exec($curl);

        $status = curl_getinfo($curl, CURLINFO_HTTP_CODE);

        if ($status != 200)
        {
            return Helper::jsonLoader(EXCEPTION, "Error: call to token URL failed with status $status, response $json_response, curl_error " . curl_error($curl) . ", curl_errno " . curl_errno($curl));
        }

        curl_close($curl);

        $response = json_decode($json_response, true);

        $access_token = $response['access_token'];
        $instance_url = $response['instance_url'];

        if (!isset($access_token) || $access_token == "")
        {
            return Helper::jsonLoader(EXCEPTION, "Error - access token missing from response!");
        }

        if (!isset($instance_url) || $instance_url == "")
        {
            return Helper::jsonLoader(EXCEPTION, "Error - instance URL missing from response!");
        }

        if(isset($response['refresh_token']))
        {
            $refresh_token = $response['refresh_token'];
            $this->setOrgConfig(['refresh_token' => $refresh_token]);
            Session::put('refresh_token', $refresh_token);
        }

        Session::put('access_token', $access_token);
        Session::put('instance_url', $instance_url);

        return true;
    }

    private function getOrgConfig()
    {
        $org_integration = OrganisationIntegration::whereOrganisationId(Auth::user()->organisation_id)
                                                  ->whereIntegrationId(4)
                                                  ->first();
        if(isset($org_integration))
        {
            $org_config = $org_integration->configuration;
            if($org_config !== "")
            {
                return json_decode($org_config,true);
            }
        }

        return null;
    }

    private function setOrgConfig($configs = [])
    {
        $org_configs = $this->getOrgConfig();
        if($org_configs === null) $org_configs = [];

        foreach($configs as $key => $val)
        {
            $org_configs[$key] = $val;
        }

        OrganisationIntegration::updateOrCreate(
            [
                'organisation_id' => Auth::user()->organisation_id,
                'integration_id' => 4
            ], ['configuration' => json_encode($org_configs)]);

        return $org_configs;
    }
}