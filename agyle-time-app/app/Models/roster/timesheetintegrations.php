<?php
use Illuminate\Database\Eloquent\Model;
/**
 * TimesheetIntegration
 *
 * @property integer $id
 * @property integer $integration_id
 * @property integer $timesheet_id
 * @property boolean $sent
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property-read \Timesheet $timesheet
 * @property-read \Integration $integration
 * @method static \Illuminate\Database\Query\Builder|\TimesheetIntegration whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\TimesheetIntegration whereIntegrationId($value)
 * @method static \Illuminate\Database\Query\Builder|\TimesheetIntegration whereTimesheetId($value)
 * @method static \Illuminate\Database\Query\Builder|\TimesheetIntegration whereSent($value)
 * @method static \Illuminate\Database\Query\Builder|\TimesheetIntegration whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\TimesheetIntegration whereUpdatedAt($value)
 */
Class TimesheetIntegration extends Model
{
    protected $table='timesheet_integrations';

    public function timesheet()
    {
        return $this->belongsTo('Timesheet');
    }

    public function integration()
    {
        return $this->belongsTo('Integration');
    }

}
