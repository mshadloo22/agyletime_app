<?php
use Illuminate\Database\Eloquent\Model;
// Model:'Subtask' - Database Table: 'subtasks'

/**
 * Subtask
 *
 * @property integer $id
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property integer $workstream_id
 * @property string $name
 * @property string $description
 * @property-read \Workstream $workstream
 * @method static \Illuminate\Database\Query\Builder|\Subtask whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\Subtask whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\Subtask whereUpdatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\Subtask whereWorkstreamId($value)
 * @method static \Illuminate\Database\Query\Builder|\Subtask whereName($value)
 * @method static \Illuminate\Database\Query\Builder|\Subtask whereDescription($value)
 */
Class Subtask extends Model
{
    protected $table='subtasks';

    public function workstream()
    {
        return $this->belongsTo('Workstream');
    }
}