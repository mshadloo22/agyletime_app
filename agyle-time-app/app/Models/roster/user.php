<?php

namespace App\Models\Roster;

use Illuminate\Auth\Authenticatable;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;
use \Illuminate\Database\Eloquent\Model;


Class User extends Model implements AuthenticatableContract, CanResetPasswordContract
{
    use Authenticatable, CanResetPassword;

    protected $table = 'user';

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = array(
        'password',
        'remember_token',
        'notification_preferences_id',
        'message_notification_id',
        'organisation_id',
        'tour_state',
        'site_id'
    );

    private $timezone_string = null;

    /**
     * Get the unique identifier for the user.
     *
     * @return mixed
     */

    public function getRememberToken()
    {
        return $this->remember_token;
    }

    public function setRememberToken($value)
    {
        $this->remember_token = $value;
    }

    public function getRememberTokenName()
    {
        return 'remember_token';
    }

    public function getAuthIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Get the password for the user.
     *
     * @return string
     */
    public function getAuthPassword()
    {
        return $this->password;
    }

    /**
     * Get the e-mail address where password reminders are sent.
     *
     * @return string
     */
    public function getReminderEmail()
    {
        return $this->email;
    }

    public function messageRelatedBySentBy()
    {
        return $this->hasMany('Message', 'sent_by');
    }

    public function messageRelatedByRecipientId()
    {
        return $this->hasMany('Message');
    }

    public function rostercomments()
    {
        return $this->belongsToMany('RosterComments');
    }
    public function rostereditableby()
    {
        return $this->belongsToMany('RosterEditableBy');
    }
    public function rosteredshift()
    {
        return $this->hasMany('RosteredShift');
    }
    public function rosteredshiftmodified()
    {
        return $this->hasMany('RosteredShiftModified');
    }

    public function shifttasks()
    {
        return $this->hasMany('ShiftTasks');
    }

    public function teamRelatedByTeamLeaderId()
    {
        return $this->hasMany('Team', 'team_leader_id');
    }

    public function teamRelatedByManagerId()
    {
        return $this->hasMany('Team', 'manager_id');
    }

    public function timesheet()
    {
        return $this->hasMany('Timesheet');
    }

    public function useravailgen()
    {
        return $this->belongsToMany('UserAvailGen');
    }
    public function useravailspec()
    {
        return $this->belongsToMany('UserAvailSpec');
    }
    public function availgeneral()
    {
        return $this->belongsToMany('AvailGeneral', 'user_avail_gen', 'user_id', 'availability_general_id')->withTimestamps();
    }
    public function availspecific()
    {
        return $this->belongsToMany('AvailSpecific', 'user_avail_spec', 'user_id', 'availability_specific_id')->withTimestamps()->withPivot('employee_notes', 'management_notes', 'authorized');
    }
    public function userevent()
    {
        return $this->hasMany('UserEvent');
    }

    public function userpayrate()
    {
        return $this->belongsToMany('UserPayRate');
    }

    public function payrate()
    {
        return $this->belongsToMany('PayRate', 'user_pay_rate', 'user_id', 'pay_rate_id')->withPivot('start_date', 'end_date', 'id');
    }

    public function billablerate()
    {
        return $this->belongsToMany('BillableRate', 'user_billable_rate', 'user_id', 'billable_rate_id')->withPivot('start_date', 'end_date', 'id');
    }

    public function notificationpreference()
    {
        return $this->belongsTo('NotificationPreference');
    }

    public function messagenotificationpreference()
    {
        return $this->belongsTo('MessageNotificationPreference');
    }

    public function city()
    {
        return $this->belongsTo('City');
    }

    public function team()
    {
        return $this->belongsTo('Team');
    }

    public function organisation()
    {
        return $this->belongsTo(\Organisation::class);
    }

    public function invoiceitem()
    {
        return $this->hasMany('InvoiceItem', 'user_id');
    }

    public function integration()
    {
        return $this->belongsToMany('Integration', 'user_integrations', 'user_id', 'integration_id')->withTimestamps()->withPivot('configuration');
    }

    public function role()
    {
        return $this->belongsToMany('Role', 'user_role', 'user_id', 'role_id')
                    ->withTimestamps();
    }

    public function site()
    {
        return $this->belongsTo('Site');
    }

    public function configpriority()
    {
        return $this->morphMany('ConfigPriority', 'configurable');
    }

    public function getTimezoneAttribute($value)
    {
        if(empty($this->timezone_string)) {
            $this->timezone_string = timezone_identifiers_list()[$value];
        }

        return $this->timezone_string;
    }

    public function setTimezoneAttribute($value)
    {
        if(!is_numeric($value)) $value = array_search($value, timezone_identifiers_list());

        $this->attributes['timezone'] = isset(timezone_identifiers_list()[$value]) ? $value : array_search('UTC', timezone_identifiers_list());
    }

    public function employmentrulestemplate() {
        return $this->belongsTo('EmploymentRulesTemplate');
    }

    public function rosteredshifthistory()
    {
        return $this->hasMany('RosteredShiftHistory', 'user_id', 'id');
    }

    public function shifttaskshistory()
    {
        return $this->hasMany('ShiftTasksHistory', 'user_id', 'id');
    }
    public function revisionShift() {
        return $this->belongsTo('\App\Model\Roster\RevisionShift');
    }

}