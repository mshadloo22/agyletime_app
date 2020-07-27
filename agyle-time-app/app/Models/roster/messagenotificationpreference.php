<?php

// Model:'MessageNotificationPreference' - Database Table: 'Message_Notification_Preference'
use Illuminate\Database\Eloquent\Model;
/**
 * MessageNotificationPreference
 *
 * @property integer $id
 * @property string $name
 * @property string $description
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection|\User[] $user
 * @method static \Illuminate\Database\Query\Builder|\MessageNotificationPreference whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\MessageNotificationPreference whereName($value)
 * @method static \Illuminate\Database\Query\Builder|\MessageNotificationPreference whereDescription($value)
 * @method static \Illuminate\Database\Query\Builder|\MessageNotificationPreference whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\MessageNotificationPreference whereUpdatedAt($value)
 */
Class MessageNotificationPreference extends Model
{

    protected $table='message_notification_preference';

    public function user()
    {
        return $this->hasMany('\App\Models\Roster\User');
    }

}