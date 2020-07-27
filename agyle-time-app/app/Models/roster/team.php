<?php
use Illuminate\Database\Eloquent\Model;
use \App\Helper\Helper;
use Illuminate\Database\Eloquent\SoftDeletes;

Class Team extends Model
{
    use SoftDeletes;

    protected $dates = ['deleted_at'];

    protected $table='team';

    public function roster()
    {
        return $this->hasMany('Roster');
    }

    public function teamavailgen()
    {
        return $this->belongsToMany('TeamAvailGen');
    }
    public function teamavailspec()
    {
        return $this->belongsToMany('TeamAvailSpec');
    }
    public function organisation()
    {
        return $this->belongsTo('Organisation');
    }

    public function userRelatedByTeamLeaderId()
    {
        return $this->belongsTo('\App\Models\Roster\User', 'team_leader_id');
    }

    public function userRelatedByManagerId()
    {
        return $this->belongsTo('\App\Models\Roster\User', 'manager_id');
    }

    public function user()
    {
        return $this->hasMany('\App\Models\Roster\User');
    }

    public function campaign()
    {
        return $this->belongsTo('Campaign');
    }

    public function invoiceitemtemplate()
    {
        return $this->hasMany('InvoiceItemTemplate', 'team_id');
    }

    public function scopeManagedTeams($query)
    {
        switch (Helper::managementStatus())
        {
            case MANAGER:
                return $query->where('team_leader_id', '=', Auth::user()->id)
                             ->orWhere('manager_id', '=', Auth::user()->id);
            case PRIMARY_CONTACT:
                return $query->where('organisation_id', '=', Auth::user()->organisation_id);
            default:
                return $query->where('id', '=', 0);
        }
    }

    public function configpriority()
    {
        return $this->morphMany('ConfigPriority', 'configurable');
    }
}