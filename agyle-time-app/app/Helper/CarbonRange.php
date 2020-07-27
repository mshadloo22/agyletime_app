<?php
namespace App\Helper;

class CarbonRange {

    public $start = null;
    public $end = null;

    public function __construct($start, $end, $timezone = null)
    {
        $this->start = $this->toCarbon($start, $timezone);
        $this->end = $this->toCarbon($end, $timezone);

        if($this->start->gt($this->end)) throw new Exception('Start time is after End time.');
    }

    public function contains($date)
    {
        $date = $this->toCarbon($date);

        return ($date->gte($this->start) && $date->lte($this->end));
    }

    public function copy()
    {
        return new CarbonRange($this->start->copy(), $this->end->copy());
    }

    public function intersect(CarbonRange $other)
    {
        if ((($this->start->lte($ref1 = $other->start) && $ref1->lt($ref = $this->end)) && $ref->lt($other->end))) {
            return new CarbonRange($other->start, $this->end);
        } else if ((($other->start->lt($ref3 = $this->start) && $ref3->lt($ref2 = $other->end)) && $ref2->lte($this->end))) {
            return new CarbonRange($this->start, $other->end);
        } else if ((($other->start->lt($ref5 = $this->start) && $ref5->lt($ref4 = $this->end)) && $ref4->lt($other->end))) {
            return $this;
        } else if ((($this->start->lte($ref7 = $other->start) && $ref7->lt($ref6 = $other->end)) && $ref6->lte($this->end))) {
            return $other;
        } else {
            return null;
        }
    }

    public function subtract(CarbonRange $other) {
        if ($this->intersect($other) === null) {
            return [$this];
        } else if ((($other->start->lte($ref1 = $this->start) && $ref1->lt($ref = $this->end)) && $ref->lte($other->end))) {
            return [];
        } else if ((($other->start->lte($ref3 = $this->start) && $ref3->lt($ref2 = $other->end)) && $ref2->lt($this->end))) {
            return [new CarbonRange($other->end, $this->end)];
        } else if ((($this->start->lt($ref5 = $other->start) && $ref5->lt($ref4 = $this->end)) && $ref4->lte($other->end))) {
            return [new CarbonRange($this->start, $other->start)];
        } else if ((($this->start->lt($ref7 = $other->start) && $ref7->lt($ref6 = $other->end)) && $ref6->lt($this->end))) {
            return [new CarbonRange($this->start, $other->start), new CarbonRange($other->end, $this->end)];
        }
    }

    public function diff($period)
    {
        switch($period)
        {
            case 'years':
                return $this->start->diffInYears($this->end);
            case 'months':
                return $this->start->diffInMonths($this->end);
            case 'weeks':
                return $this->start->diffInWeeks($this->end);
            case 'days':
                return $this->start->diffInDays($this->end);
            case 'hours':
                return $this->start->diffInHours($this->end);
            case 'minutes':
                return $this->start->diffInMinutes($this->end);
            default:
                return $this->start->diffInSeconds($this->end);
        }
    }

    public function timezone($timezone)
    {
        $this->start->timezone($timezone);
        $this->end->timezone($timezone);

        return $this;
    }

    private function toCarbon($date, $timezone = null) {
        return $date instanceof \Carbon\Carbon ?
            $date->copy() :
            \Carbon\Carbon::parse($date, $timezone);
    }
}


?>