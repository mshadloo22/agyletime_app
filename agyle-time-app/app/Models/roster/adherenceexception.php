<?php
use Carbon\Carbon;
use \App\Helper\Helper;
use Illuminate\Database\Eloquent\Model;
Class AdherenceException extends Model
{
    public $autoHydrateEntityFromInput = true;

    protected $table = 'adherence_exception';

    protected $fillable = array('start_time', 'end_time', 'rostered_shift_id');

    protected $dates = array('start_time', 'end_time');

    public static $rules = array(
        'start_time' => 'sometimes|required',
        'end_time' => 'sometimes|required',
        'rostered_shift_id' => 'sometimes|required|integer',
    );


    public function rosteredshift(){
        return $this->belongsTo(RosteredShift::class,"rostered_shift_id");
    }

    public function beforeSave()
    {
        $this->start_time = new Carbon($this->start_time->toDateTimeString(), Helper::organisationTimezone());
        $this->end_time = new Carbon($this->end_time->toDateTimeString(), Helper::organisationTimezone());
    }
}