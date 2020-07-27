<?php
use Illuminate\Database\Eloquent\Model;
/**
 * UserIntegration
 *
 * @property integer $id
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property integer $integration_id
 * @property integer $user_id
 * @property string $configuration
 * @property-read \User $user
 * @property-read \Integration $integration
 * @method static \Illuminate\Database\Query\Builder|\UserIntegration whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\UserIntegration whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\UserIntegration whereUpdatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\UserIntegration whereIntegrationId($value)
 * @method static \Illuminate\Database\Query\Builder|\UserIntegration whereUserId($value)
 * @method static \Illuminate\Database\Query\Builder|\UserIntegration whereConfiguration($value)
 */
Class UserIntegration extends Model
{
    protected $table = 'user_integrations';

    protected $guarded = array('id');

    public function user()
    {
        return $this->belongsTo('\App\Models\Roster\User');
    }

    public function integration()
    {
        return $this->belongsTo('Integration');
    }

}
