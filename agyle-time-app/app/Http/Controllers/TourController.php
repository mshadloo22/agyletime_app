<?php
use \App\Helper\Helper;
class TourController extends BaseController
{
    public function restart_tour()
    {
        $user = Auth::user();
        $user->tour_state = 0;
        $user->save();

        return Redirect::route('user_profile');
    }

    public function postFinishTour()
    {
        $user = Auth::user();

        $user->tour_state = "finished";

        $user->save();

        return Helper::jsonLoader(SUCCESS);
    }

    public function postTourStep()
    {
        if (Input::has('tour_step'))
        {
            $tour_step = Input::get('tour_step');
            $user = Auth::user();

            $user->tour_state = $tour_step;

            $user->save();

            return Helper::jsonLoader(SUCCESS);
        }
    }

    public function getTourStep()
    {
        $tour_state = Auth::user()->tour_state;
        if ($tour_state == "")
        {
            return Helper::jsonLoader(SUCCESS, array('tour_state' => 0));
        } else
        {
            return Helper::jsonLoader(SUCCESS, array('tour_state' => $tour_state));
        }

    }
}
