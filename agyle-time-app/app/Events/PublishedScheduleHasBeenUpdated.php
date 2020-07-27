<?php

namespace App\Events;

use App\Events\Event;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class PublishedScheduleHasBeenUpdated extends Event
{
    use SerializesModels;

    public $schedule;
    public $date_start;
    public $date_end;
    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($schedule, $date_start, $date_end)
    {
        //
        $this->schedule = $schedule;
        $this->date_start = $date_start;
        $this->date_end = $date_end;
    }

    /**
     * Get the channels the event should be broadcast on.
     *
     * @return array
     */
    public function broadcastOn()
    {
        return [];
    }
}
