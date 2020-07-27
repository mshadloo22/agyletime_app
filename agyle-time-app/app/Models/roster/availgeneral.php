<?php
use Carbon\Carbon;
use \App\Helper\Helper;
use Illuminate\Database\Eloquent\Model;
// Model:'AvailGeneral' - Database Table: 'Avail_General'

/**
 * AvailGeneral
 *
 * @property integer $id
 * @property string $day
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property string $start_time
 * @property string $end_time
 * @property-read \Illuminate\Database\Eloquent\Collection|\OrgAvailGen[] $orgavailgen
 * @property-read \Illuminate\Database\Eloquent\Collection|\TeamAvailGen[] $teamavailgen
 * @property-read \Illuminate\Database\Eloquent\Collection|\UserAvailGen[] $useravailgen
 * @method static \Illuminate\Database\Query\Builder|\AvailGeneral whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\AvailGeneral whereDay($value)
 * @method static \Illuminate\Database\Query\Builder|\AvailGeneral whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\AvailGeneral whereUpdatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\AvailGeneral whereStartTime($value)
 * @method static \Illuminate\Database\Query\Builder|\AvailGeneral whereEndTime($value)
 */
Class AvailGeneral extends Model
{

    protected $table='avail_general';

    public function orgavailgen()
    {
        return $this->hasMany('OrgAvailGen', 'availability_general_id');
    }

    public function teamavailgen()
    {
        return $this->belongsToMany('TeamAvailGen');
    }
    public function useravailgen()
    {
        return $this->belongsToMany('UserAvailGen');
    }
    /*public function user()
    {
        return $this->belongsToMany('user', 'user_avail_gen', 'user_id', 'availability_general_id');
    }*/

    public function getStartTimeAttribute($value)
    {
        if(substr_count($value, ":") === 0) $value = "23:00:00";
        $value = explode(':',$value);
        while(count($value) < 3) $value[] = 0;
        $value = Carbon::createFromTime($value[0], $value[1], $value[2], Config::get('app.timezone'));
        return $value->timezone(Helper::organisationTimezone())->toTimeString();
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
        if(substr_count($value, ":") === 0) $value = "07:00:00";
        $value = explode(':',$value);
        while(count($value) < 3) $value[] = 0;
        $value = Carbon::createFromTime($value[0], $value[1], $value[2], Config::get('app.timezone'));
        return $value->timezone(Helper::organisationTimezone())->toTimeString();
    }

    public function setEndTimeAttribute($value)
    {
        $value = explode(':',$value);
        while(count($value) < 3) $value[] = 0;
        $value = Carbon::createFromTime($value[0], $value[1], $value[2], Helper::organisationTimezone());
        $this->attributes['end_time'] = $value->timezone(Config::get('app.timezone'))->toTimeString();
    }
}