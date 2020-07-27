<?php
use Illuminate\Database\Eloquent\Model;
Class EmploymentRulesTemplate extends Model
{
    public $autoHydrateEntityFromInput = true;

    public $forceEntityHydrationFromInput = true;

    protected $table = "employment_rules_template";

    protected $hidden = array('organisation_id');

    protected $guarded = array('id');

    public static $rules = array(
        'name' => 'sometimes|required',
        'min_shift_length' => 'sometimes|numeric',
        'max_shift_length' => 'sometimes|numeric',
        'min_hours_per_week' => 'sometimes|numeric',
        'max_hours_per_week' => 'sometimes|numeric',
        'min_time_between_breaks' => 'sometimes|numeric',
        'max_time_between_breaks' => 'sometimes|numeric',
        'min_shifts_per_week' => 'sometimes|numeric',
        'max_shifts_per_week' => 'sometimes|numeric',
        'min_time_between_shifts' => 'sometimes|numeric',
        'saturday_pay_multiplier' => 'sometimes|numeric',
        'sunday_pay_multiplier' => 'sometimes|numeric',
        'overtime_pay_multiplier' => 'sometimes|numeric',
        'hours_before_overtime_rate' => 'sometimes|numeric',
    );

    public function user() {
        return $this->hasMany('\App\Models\Roster\User');
    }

    public function organisation() {
        return $this->belongsTo('Organisation');
    }

}

?>