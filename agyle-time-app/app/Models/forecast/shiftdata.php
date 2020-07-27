<?php

// Model:'ShiftData' - Database Table: 'shift_data'
use \App\Helper\Helper;
use \Carbon\Carbon;
/**
 * ShiftData
 *
 * @property integer $id
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property \Carbon\Carbon $start_time
 * @property \Carbon\Carbon $end_time
 * @property integer $shift_id
 * @property integer $organisation_id
 * @property integer $shift_length
 * @property string $identifier
 * @property string $agent_alias
 * @property string $last_ping
 * @method static \Illuminate\Database\Query\Builder|\ShiftData whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\ShiftData whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\ShiftData whereUpdatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\ShiftData whereStartTime($value)
 * @method static \Illuminate\Database\Query\Builder|\ShiftData whereEndTime($value)
 * @method static \Illuminate\Database\Query\Builder|\ShiftData whereShiftId($value)
 * @method static \Illuminate\Database\Query\Builder|\ShiftData whereOrganisationId($value)
 * @method static \Illuminate\Database\Query\Builder|\ShiftData whereShiftLength($value)
 * @method static \Illuminate\Database\Query\Builder|\ShiftData whereIdentifier($value)
 * @method static \Illuminate\Database\Query\Builder|\ShiftData whereAgentAlias($value)
 * @method static \Illuminate\Database\Query\Builder|\ShiftData whereLastPing($value)
 */
Class ShiftData extends \LaravelArdent\Ardent\Ardent
{
    public $autoHydrateEntityFromInput = true;

    protected $table = 'shift_data';

    protected $connection = 'forecast_mysql';

    protected $fillable = array('start_time', 'end_time', 'shift_id', 'organisation_id', 'shift_length', 'identifier', 'agent_alias');

    public static $rules = array(
        'start_time' => 'sometimes|required',
        'end_time' => 'sometimes',
        'shift_id' => 'required_without:identifier|integer',
        'organisation_id' => 'sometimes|integer',
        'shift_length' => 'sometimes|integer',
        'identifier' => 'required_without:shift_id|alpha_dash',
        'agent_alias' => 'sometimes|alpha_dash',
    );

    public function __construct(array $attributes = array())
    {
        parent::__construct($attributes);

        //Code snippet that is supposed to set end time to be last ping in certain situations. Have been unable to catch the event
        //when attributes are filled into
        /*$attributes = $this->attributes;
        Log::info(print_r($this, true));
        if ($attributes['last_ping'] != '0000-00-00 00:00:00' && Carbon::parse($attributes['last_ping'])->diffInSeconds(Carbon::now()) > 600)
        {
            $attributes['end_time'] = $attributes['last_ping'];
            $this->save();
        }*/
    }


    public function beforeSave()
    {

        if(Input::has('start_time'))
        {
            $this->end_time = 0;
            $this->shift_length = 0;
            if(empty($this->start_time)) {
                $this->start_time = Carbon::parse(Input::get('start_time'), Helper::organisationTimezone())->tz('UTC');
            }
        }

        if(Input::has('end_time'))
        {
            $this->end_time = Carbon::parse(Input::get('end_time'), Helper::organisationTimezone())->tz('UTC');
        }
        $start_of_time = '0000-00-00 00:00:00';

        if($this->start_time != $start_of_time && $this->end_time != $start_of_time)
        {
            $this->shift_length = Carbon::parse($this->start_time)->diffInSeconds(Carbon::parse($this->end_time));
        }
//        if($this->end_time != $start_of_time && !date_parse_from_format('Y-m-d H:i:s', $this->end_time)) false;

        // add validation for end_time
        if($this->end_time == $start_of_time || !date_parse_from_format('Y-m-d H:i:s', $this->end_time))
        {
            return false;
        }
        return true;
    }

    public function beforeCreate()
    {
        if(Input::has('start_time'))
        {
            $this->start_time = Carbon::parse(Input::get('start_time'), Helper::organisationTimezone())->tz('UTC');

        }else{
//            $this->start_time = Carbon::parse($this->start_time, Helper::organisationTimezone())->tz('UTC');//Now?
            //yes get now
            $this->start_time = Carbon::now(Helper::organisationTimezone())->tz('UTC');
        }

        $this->organisation_id = Auth::user()->organisation_id;
        if(isset($this->shift_id) && !isset($this->identifier)) $this->identifier = $this->shift_id;
        if(!isset($this->agent_alias)) $this->agent_alias = Auth::user()->id;
    }

    public function getEndTimeAttribute($value) {
        if($value=="0000-00-00 00:00:00") {
            $result = Carbon::now('Australia/Melbourne');
        } else {
            $result = Carbon::createFromFormat($this->getDateFormat(), $value);
        }
        $end_of_day = $this->start_time->copy()->endOfDay()->tz('Australia/Melbourne');
        if($result->gt($end_of_day)) {
            $result = $end_of_day;
        }
        return $result;
    }


}