<?php
namespace App\Helper;

use \App\Models\Roster\Feature as FeatureModel;

class Feature
{
    private static $feature_list = [];

    /**
     * Enable the group menu if there are any one child feature enabled
     * @param $group_name
     * @return Whether any of child feature enabled
     */
    public static function canGroup($group_name)
    {
        switch ($group_name) {
            case "Realtime":
                return self::can('Realtime Performance') || self::can('Realtime Adherence')
                || self::can('Realtime Activity');
            break;
            case "Schedule":
                return self::can('Roster') || self::can('Forecast')
                || self::can('Schedule');
            break;
            case "My Time":
                return self::can('Timesheets') || self::can('Roster');
            break;
            case "Management":
                return self::can('Timesheets') || self::can('Leave Requests')
                || self::can('Reports');
                break;
            default:
                return false;
        }

    }

    /**
     * Check if this feature enabled
     * @param $feature_name
     * @return bool is_this_feature_enabled
     */
    public static function can($feature_name)
    {
        if (count(self::$feature_list) == 0) {
            self::canAll();
        }
        $feature_result = true;
        foreach (self::$feature_list as $feature) {
            if ($feature->name === $feature_name) {
                $feature_result = $feature->enabled;
            }
        }

        return $feature_result;
    }

    public static function canBoth($first_feature_name, $second_feature_name)
    {
        return self::can($first_feature_name) || self::can($second_feature_name);
    }

    /**
     * Filling in a static variable with all feature enablements for this org
     * @param null $organisation
     */
    private static function canAll($organisation = null)
    {
        if ($organisation == null) {
            $organisation = \Auth::user()->organisation;
        }
        self::$feature_list = $organisation->canAll();
    }
}

?>