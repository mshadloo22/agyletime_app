<?php

Class ShiftTaskHistory extends \LaravelArdent\Ardent\Ardent
{
    protected $table = 'shift_tasks_history';

    protected $fillable = array('start_time', 'end_time', 'roster_id', 'user_id', 'shift_tasks_id', 'event_type', 'rostered_shift_history_id', 'task_id');

    protected $dates = array('start_time', 'end_time');

    public static $relationsData = array(
        'createdby' => array(self::BELONGS_TO, 'User', 'foreignKey', 'created_by'),
        'rosteredshifthistory' => array(self::BELONGS_TO, "RosteredShiftHistory", 'foreignKey' => 'rostered_shift_history_id'),
        'shifttask' => array(self::BELONGS_TO, 'ShiftTask', 'foreignKey', 'shift_tasks_id'),
        'createdevent' => array(self::BELONGS_TO, 'ShiftTaskHistory', 'foreignKey', 'created_event_id'),
        'updateevents' => array(self::HAS_MANY, 'ShiftTaskHistory', 'foreignKey', 'created_event_id'),
        'task' => array(self::BELONGS_TO, 'Task', 'foreignKey', 'task_id'),
    );

    public function beforeCreate()
    {
        $this->attributes['created_by'] = Auth::user()->id;

        if($this->attributes['event_type'] !== 'created')
        {
            $temp = ShiftTaskHistory::whereShiftTasksId($this->attributes['shift_tasks_id'])
                                    ->whereEventType('created')
                                    ->first();
            if(!isset($temp))
            {
                $temp = ShiftTaskHistory::whereShiftTasksId($this->attributes['shift_tasks_id'])
                                        ->whereEventType('updated')
                                        ->orderBy('created_at', 'asc')
                                        ->first();
            }
            if(isset($temp)) $this->attributes['created_event_id'] = $temp->id;
        }
    }
}