<?php

// Model:'NotificationPreference' - Database Table: 'Notification_Preference'
use Illuminate\Database\Eloquent\Model;
/**
 * NotificationPreference
 *
 * @property integer $id
 * @property string $name
 * @property string $description
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection|\User[] $user
 * @method static \Illuminate\Database\Query\Builder|\NotificationPreference whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\NotificationPreference whereName($value)
 * @method static \Illuminate\Database\Query\Builder|\NotificationPreference whereDescription($value)
 * @method static \Illuminate\Database\Query\Builder|\NotificationPreference whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\NotificationPreference whereUpdatedAt($value)
 */
Class NotificationPreference extends Model
{

    protected $table='notification_preference';

    public function user()
    {
        return $this->hasMany('\App\Models\Roster\User');
    }

}