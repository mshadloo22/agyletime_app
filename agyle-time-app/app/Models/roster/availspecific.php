<?php
use Carbon\Carbon;
use \App\Helper\Helper;
use Illuminate\Database\Eloquent\Model;
// Model:'AvailSpecific' - Database Table: 'Avail_Specific'

/**
 * AvailSpecific
 *
 * @property integer $id
 * @property \Carbon\Carbon $start_date
 * @property \Carbon\Carbon $end_date
 * @property \Carbon\Carbon $start_time
 * @property \Carbon\Carbon $end_time
 * @property boolean $all_day
 * @property boolean $is_available
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection|\OrgAvailSpec[] $orgavailspec
 * @property-read \Illuminate\Database\Eloquent\Collection|\TeamAvailSpec[] $teamavailspec
 * @property-read \Illuminate\Database\Eloquent\Collection|\UserAvailSpec[] $useravailspec
 * @property-read \Illuminate\Database\Eloquent\Collection|\User[] $user
 * @method static \Illuminate\Database\Query\Builder|\AvailSpecific whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\AvailSpecific whereStartDate($value)
 * @method static \Illuminate\Database\Query\Builder|\AvailSpecific whereEndDate($value)
 * @method static \Illuminate\Database\Query\Builder|\AvailSpecific whereStartTime($value)
 * @method static \Illuminate\Database\Query\Builder|\AvailSpecific whereEndTime($value)
 * @method static \Illuminate\Database\Query\Builder|\AvailSpecific whereAllDay($value)
 * @method static \Illuminate\Database\Query\Builder|\AvailSpecific whereIsAvailable($value)
 * @method static \Illuminate\Database\Query\Builder|\AvailSpecific whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\AvailSpecific whereUpdatedAt($value)
 * @method static \AvailSpecific withinLeave($start_date, $end_date = null)
 */
Class AvailSpecific extends Model
{
    protected $table='avail_specific';

    public function orgavailspec()
    {
        return $this->belongsToMany('OrgAvailSpec');
    }
    public function teamavailspec()
    {
        return $this->belongsToMany('TeamAvailSpec');
    }
    public function useravailspec()
    {
        return $this->belongsToMany('UserAvailSpec');
    }
    public function user()
    {
        return $this->belongsToMany('\App\Models\Roster\User', 'user_avail_spec', 'availability_specific_id', 'user_id')->withTimestamps()->withPivot('employee_notes', 'management_notes', 'authorized');
    }

    public function scopeWithinLeave($query, $start_date, $end_date = null)
    {
        if(is_null($end_date)) $end_date = $start_date;

        return $query->where(function ($query) use ($start_date, $end_date)
        {
            $query->orWhere(function ($query) use ($start_date, $end_date)
            {
                $query->where('start_date', '<=', $start_date->toDateString())
                      ->where('end_date', '>=', $start_date->toDateString());
            })->orWhere(function ($query) use ($start_date, $end_date)
                  {
                      $query->where('start_date', '>=', $start_date->toDateString())
                            ->where('start_date', '<=', $end_date->toDateString());
                  })->orWhere(function ($query) use ($start_date, $end_date)
                  {
                      $query->where('start_date', '<=', $start_date->toDateString())
                            ->where('end_date', '>=', $end_date->toDateString());
                  })->orWhere(function ($query) use ($start_date, $end_date)
                  {
                      $query->where('start_date', '>=', $start_date->toDateString())
                            ->where('end_date', '<=', $end_date->toDateString());
                  });
        });
    }

    public function getStartTimeAttribute($value)
    {
        if($value !== null)
        {
            $start_date = $this->attributes['start_date'];
            $value = new Carbon("$start_date $value", Config::get('app.timezone'));
            return $value->timezone(Helper::organisationTimezone())->toTimeString();
        } else
        {
            return $value;
        }
    }

    public function setStartTimeAttribute($value)
    {
        $value = explode(':',$value);
        while(count($value) < 3) $value[] = 0;
        $value = Carbon::createFromTime($value[0], $value[1], $value[2], Helper::organisationTimezone());
        $this->attributes['start_time'] = $value->timezone(Config::get('app.timezone'))->toTimeString();
    }

    public function getEndTimeAttribute($value)
    {
        if($value !== null)
        {
            $end_date = $this->attributes['end_date'];
            $value = new Carbon("$end_date $value", Config::get('app.timezone'));
            return $value->timezone(Helper::organisationTimezone())->toTimeString();
        } else
        {
            return $value;
        }
    }

    public function setEndTimeAttribute($value)
    {
        $value = explode(':',$value);
        while(count($value) < 3) $value[] = 0;
        $value = Carbon::createFromTime($value[0], $value[1], $value[2], Helper::organisationTimezone());
        $this->attributes['end_time'] = $value->timezone(Config::get('app.timezone'))->toTimeString();
    }

    public function getStartDateAttribute($value)
    {
        if($value !== null)
        {
            $start_time = $this->attributes['start_time'];
            $value = new Carbon("$value $start_time", Config::get('app.timezone'));
            return $value->timezone(Helper::organisationTimezone())->toDateString();
        } else
        {
            return $value;
        }
    }

    public function getEndDateAttribute($value)
    {
        if($value !== null)
        {
            $end_time = $this->attributes['end_time'];
            $value = new Carbon("$value $end_time", Config::get('app.timezone'));
            return $value->timezone(Helper::organisationTimezone())->toDateString();
        } else
        {
            return $value;
        }
    }
}