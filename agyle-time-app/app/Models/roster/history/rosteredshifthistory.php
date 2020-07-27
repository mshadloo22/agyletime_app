<?php

Class RosteredShiftHistory extends \LaravelArdent\Ardent\Ardent
{
    protected $table = 'rostered_shift_history';

    protected $fillable = array('date', 'start_time', 'end_time', 'roster_id', 'user_id', 'rostered_shift_id', 'event_type');

    protected $dates = array('date', 'start_time', 'end_time');

    public static $relationsData = array(
        'createdby' => array(self::BELONGS_TO, 'User', 'foreignKey', 'created_by'),
        'rosteredshift' => array(self::BELONGS_TO, "RosteredShift", 'foreignKey' => 'rostered_shift_id'),
        'user' => array(self::BELONGS_TO, 'User', 'foreignKey', 'user_id'),
        'roster' => array(self::BELONGS_TO, 'Roster', 'foreignKey', 'roster_id'),
        'createdevent' => array(self::BELONGS_TO, 'RosteredShiftHistory', 'foreignKey', 'created_event_id'),
        'updateevents' => array(self::HAS_MANY, 'RosteredShiftHistory', 'foreignKey', 'created_event_id')
    );

    public function beforeCreate()
    {
        $this->attributes['created_by'] = Auth::user()->id;

        if($this->attributes['event_type'] !== 'created')
        {
            $temp = RosteredShiftHistory::whereRosteredShiftId($this->attributes['rostered_shift_id'])
                                        ->whereEventType('created')
                                        ->first();
            if(!isset($temp))
            {
                $temp = RosteredShiftHistory::whereRosteredShiftId($this->attributes['rostered_shift_id'])
                                            ->whereEventType('updated')
                                            ->orderBy('created_at', 'asc')
                                            ->first();
            }
            if(isset($temp)) $this->attributes['created_event_id'] = $temp->id;
        }
    }
}