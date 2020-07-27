<?php

// Model:'Message' - Database Table: 'Message'
use Illuminate\Database\Eloquent\Model;
/**
 * Message
 *
 * @property integer $id
 * @property integer $sent_by
 * @property integer $recipient_id
 * @property string $subject
 * @property string $content
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property-read \UserRelatedBySentBy $userRelatedBySentBy
 * @property-read \UserRelatedByRecipientId $userRelatedByRecipientId
 * @method static \Illuminate\Database\Query\Builder|\Message whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\Message whereSentBy($value)
 * @method static \Illuminate\Database\Query\Builder|\Message whereRecipientId($value)
 * @method static \Illuminate\Database\Query\Builder|\Message whereSubject($value)
 * @method static \Illuminate\Database\Query\Builder|\Message whereContent($value)
 * @method static \Illuminate\Database\Query\Builder|\Message whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\Message whereUpdatedAt($value)
 */
Class Message extends Model
{

    protected $table='message';

    public function userRelatedBySentBy()
    {
        return $this->belongsTo('UserRelatedBySentBy');
    }

    public function userRelatedByRecipientId()
    {
        return $this->belongsTo('UserRelatedByRecipientId');
    }

}