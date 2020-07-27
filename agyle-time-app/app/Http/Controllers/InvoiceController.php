<?php

use \App\Helper\Helper;
use Carbon\Carbon;
class InvoiceController extends BaseController
{
    public function __construct()
    {
        $this->beforeFilter('management');
    }

    public function edit_invoice_template()
    {
        return View::make('edit_invoice_template');
    }

    public function invoices()
    {
        return View::make('invoices');
    }

    public function getInvoiceTemplate()
    {
        try
        {
            $invoice_template = InvoiceTemplate::where(function ($query)
            {
                $query->where('organisation_id', '=', Auth::user()->organisation_id);
                if (Input::has('invoice_template_id')) $query->where('id', '=', Input::get('invoice_template_id'));
                if (Input::has('integration_name')) $query->where('integrations', '=', Input::get('integration_name'));
            })
                                               ->with('invoicecalendar')
                                               ->getInvoiceItemTemplate(Input::has('with_item_templates'))
                                               ->getInvoice(Input::has('with_invoices'))
                                               ->get();

        } catch (Exception $e)
        {
            return Helper::jsonLoader(EXCEPTION, array('code' => $e->getCode(), 'message' => $e->getMessage()));
        }

        return isset($invoice_template) ? Helper::jsonLoader(SUCCESS, $invoice_template) : Helper::jsonLoader(DATA_NOT_FOUND);
    }

    public function postInvoiceTemplate()
    {
        $input = Input::json()->all();
        if (isset($input['id']))
        {
            $invoice_template = InvoiceTemplate::find($input['id']);
        } else
        {
            $invoice_template = new InvoiceTemplate;
            $invoice_template->organisation_id = Auth::user()->organisation_id;
        }

        $invoice_template->fill($input);

        $invoice_calendar = InvoiceCalendar::firstOrCreate(array('start_date' => $input['start_date'], 'period' => $input['period']));

        $invoice_template->invoice_calendar_id = $invoice_calendar->id;

        $invoice_template->next_run_date = $this->invoiceEndDate($input['start_date'], $input['period']);

        if (!$invoice_template->save())
        {
            return Helper::jsonLoader(INCORRECT_DATA, $invoice_template->errors()->all());
        } else
        {
            return Helper::jsonLoader(SUCCESS, ['id' => $invoice_template->id]);
        }
    }

    public function deleteInvoiceTemplate()
    {
        if (Input::has('id'))
            InvoiceTemplate::destroy(Input::get('id'));
    }

    public function getInvoiceItemTemplate()
    {
        try
        {
            $invoice_item_template = InvoiceItemTemplate::where(function ($query)
            {
                if (Input::has('invoice_item_template_id')) $query->where('id', '=', Input::get('invoice_item_template_id'));
                if (Input::has('invoice_template_id')) $query->where('invoice_template_id', '=', Input::get('invoice_template_id'));
            })->get();
        } catch (Exception $e)
        {
            return Helper::jsonLoader(EXCEPTION, array('code' => $e->getCode(), 'message' => $e->getMessage()));
        }

        foreach ($invoice_item_template as $item)
        {
            $item->tracking = ($item->tracking !== "") ? json_decode($item->tracking, true) : "";
        }
        return isset($invoice_item_template) ? Helper::jsonLoader(SUCCESS, $invoice_item_template) : Helper::jsonLoader(DATA_NOT_FOUND);
    }

    public function postInvoiceItemTemplate()
    {
        $input = Input::json()->all();
        if (isset($input['id']))
        {
            $invoice_item_template = InvoiceItemTemplate::find($input['id']);
        } else
        {
            $invoice_item_template = new InvoiceItemTemplate;
        }
        $input['tracking'] = is_array($input['tracking']) ? json_encode($input['tracking']) : "";
        $invoice_item_template->fill($input);

        if (!$invoice_item_template->save())
        {
            return Helper::jsonLoader(INCORRECT_DATA, $invoice_item_template->errors()->all());
        } else
        {
            return Helper::jsonLoader(SUCCESS, ["id" => $invoice_item_template->id]);
        }
    }

    public function deleteInvoiceItemTemplate()
    {
        if (Input::has('id'))
            InvoiceItemTemplate::destroy(Input::get('id'));
    }

    public function getIntegrationConfigs()
    {
        if (Input::has(array('integration_id', 'option_keys')))
        {
            try
            {
                $organisation_integration = OrganisationIntegration::where('integration_id', '=', Input::get('integration_id'))
                                                                   ->where('organisation_id', '=', Auth::user()->organisation_id)
                                                                   ->with(array('orgintegrationconfig' => function ($query)
                                                                   {
                                                                       $query->whereIn('option_key', Input::get('option_keys'))
                                                                             ->with('orgintegrationconfigoption');
                                                                   }))->first();
            } catch (Exception $e)
            {
                return Helper::jsonLoader(EXCEPTION, array('code' => $e->getCode(), 'message' => $e->getMessage(), 'line' => $e->getLine()));
            }
            return Helper::jsonLoader(SUCCESS, $organisation_integration->toArray());
        } else
        {
            return Helper::jsonLoader(INCORRECT_DATA);
        }
    }

    public function getInvoice()
    {
        $generation_errors = $this->generateInvoices();

        $start_date = Input::get('start_date');
        $end_date = Input::get('end_date');

        $start_date = (isset($start_date)) ? Carbon::parse($start_date, Helper::organisationTimezone())->timezone(Config::get('app.timezone')) : null;
        $end_date = (isset($end_date)) ? Carbon::parse($end_date, Helper::organisationTimezone())->timezone(Config::get('app.timezone')) : null;

        try
        {
            $invoices = Invoice::where(function ($query) use ($start_date, $end_date)
            {
                $query->where('organisation_id', '=', Auth::user()->organisation_id);
                if (Input::has('invoice_template_id')) $query->where('invoice_template_id', '=', Input::get('invoice_template_id'));
                if (Input::has('invoice_id')) $query->where('id', '=', 'invoice_id');
                if (isset($start_date)) $query->where('start_date', '>=', $start_date->toDateString());
                if (isset($end_date)) $query->where('end_date', '<=', $end_date->toDateString());
            })/*->whereHas('invoiceitem', function($query) {
                    if(Input::has('team_id')) $query->whereHas('invoiceitemtemplate', function($query) {
                        $query->where('team_id', '=', Input::get('team_id'));
                    });
            })*/
                               ->with('invoicetemplate.invoicecalendar')
                               ->with('invoiceitem.invoiceitemtemplate')
                               ->get();

        } catch (Exception $e)
        {
            return Helper::jsonLoader(EXCEPTION, array('code' => $e->getCode(), 'message' => $e->getMessage()));
        }

        return isset($invoices) ? Helper::jsonLoader(SUCCESS, ['invoices' => $invoices->toArray(), 'errors' => $generation_errors]) : Helper::jsonLoader(DATA_NOT_FOUND);
    }

    private function generateInvoices()
    {
        $today = Carbon::now(Helper::organisationTimezone())->startOfDay()->timezone(Config::get('app.timezone'));
        $errors = [];
        $invoice_templates = InvoiceTemplate::with('invoicecalendar')->with(array('invoiceitemtemplate.team.user' => function ($query)
        {
            $query->where('user.active', '=', true)
                  ->with(array('billablerate' => function ($query)
                  {
                      $query->where('user_billable_rate.end_date', '=', null);
                  }));
        }))
                                            ->where('next_run_date', '<=', $today->toDateTimeString())
                                            ->get();

        if ($invoice_templates->isEmpty()) return false;

        foreach ($invoice_templates as $template) ;
        {
            while (Carbon::parse($template->next_run_date)->lte($today))
            {
                try
                {
                    $invoice = New Invoice;
                    $invoice->invoice_template_id = $template->id;
                    $invoice->organisation_id = Auth::user()->organisation_id;
                    $invoice->end_date = $template->next_run_date;
                    $invoice->start_date = $this->invoiceStartDate($invoice->end_date, $template->invoicecalendar->period);
                    $invoice->issued_date = Carbon::parse($invoice->end_date, Helper::organisationTimezone())->addDays($template->issued_date_offset)->toDateString();
                    $invoice->reference = $this->parseReferenceTemplate($template->reference_template, $template, $invoice);
                    $invoice->status = $template->status;
                    $invoice->tax_included = $template->tax_included;
                    $invoice->sent = false;
                    $invoice->save();

                    foreach ($template->invoiceitemtemplate as $item_template)
                    {
                        foreach ($item_template->team->user as $user)
                        {
                            $invoice_item = new InvoiceItem;
                            $invoice_item->invoice_id = $invoice->id;
                            $invoice_item->user_id = $user->id;
                            $invoice_item->billable_rate_id = isset($user->billablerate[0]) ? $user->billablerate[0]->id : 0;
                            $invoice_item->invoice_item_template_id = $item_template->id;
                            $invoice_item->description = $this->parseDescriptionTemplate($item_template->description_template, $invoice, $item_template, $user);
                            $invoice_item->quantity = $this->unitsWorked($invoice->start_date, $invoice->end_date, $user);
                            $invoice_item->save();
                        }
                    }
                    $template->next_run_date = $this->addPeriod($template->next_run_date, $template->invoicecalendar->period);

                } catch (Exception $e)
                {
                    $errors[] = ['template' => $template->name, 'code' => $e->getCode(), 'line' => $e->getLine(), 'message' => $e->getMessage()];
                }
            }
            $template->save();
        }
        return $errors;
    }

    public function getInvoiceItem()
    {

    }

    public function postInvoiceItem()
    {

    }

    private function parseReferenceTemplate($template, $invoice_template, $invoice)
    {
        if (str_contains($template, "[contact_name]"))
        {
            $contact = OrgIntegrationConfigOption::where('identifier', '=', $invoice_template->contact)->first();
            $contact = json_decode($contact->option, true);
            $template = str_replace("[contact_name]", $contact['Name'], $template);
        }

        $template = str_replace("[start_date]", Carbon::parse($invoice->start_date, Helper::organisationTimezone())->toDateString(), $template);
        $template = str_replace("[end_date]", Carbon::parse($invoice->end_date, Helper::organisationTimezone())->toDateString(), $template);

        return $template;
    }

    private function parseDescriptionTemplate($template, $invoice, $item_template, $user)
    {
        $template = str_replace("[start_date]", Carbon::parse($invoice->start_date, Helper::organisationTimezone())->toDateString(), $template);
        $template = str_replace("[end_date]", Carbon::parse($invoice->end_date, Helper::organisationTimezone())->toDateString(), $template);
        $template = str_replace("[first_name]", $user->first_name, $template);
        $template = str_replace("[last_name]", $user->last_name, $template);
        $template = str_replace("[team_name]", $item_template->team->name, $template);
        $template = str_replace("[hours_worked]", $this->unitsWorked($invoice->start_date, $invoice->end_date, $user), $template);

        return $template;
    }

    private function invoiceStartDate($end_date, $period)
    {
        $end_date = new Carbon($end_date, Helper::organisationTimezone());

        switch ($period)
        {
            case 'week':
                $end_date->startOfWeek();
                break;
            case 'fortnight':
                $end_date->subWeek()->startOfWeek();
                break;
            case 'four week':
                $end_date->subWeeks(3)->startOfWeek();
                break;
            case 'month':
                $end_date->subMonth()->addDay()->startOfDay();
                break;
        }

        return $end_date->toDateTimeString();
    }

    private function invoiceEndDate($start_date, $period)
    {
        $start_date = new Carbon($start_date, Helper::organisationTimezone());

        switch ($period)
        {
            case 'week':
                $start_date->endOfWeek();
                break;
            case 'fortnight':
                $start_date->addWeek()->endOfWeek();
                break;
            case 'four week':
                $start_date->addWeeks(3)->endOfWeek();
                break;
            case 'month':
                $start_date->addMonth()->subDay()->endOfDay();
                break;
        }

        return $start_date->toDateTimeString();
    }

    private function addPeriod($last_run_date, $period)
    {
        $last_run_date = Carbon::parse($last_run_date, Helper::organisationTimezone());

        switch ($period)
        {
            case 'week':
                $last_run_date->addWeek();
                break;
            case 'fortnight':
                $last_run_date->addWeeks(2);
                break;
            case 'four week':
                $last_run_date->addWeeks(4);
                break;
            case 'month':
                $last_run_date->addMonth();
                break;
        }

        return $last_run_date->toDateTimeString();
    }

    private function unitsWorked($start_date, $end_date, $user)
    {
        $units_worked = 0;
        $timesheets = Timesheet::where('user_id', '=', $user->id)
                               ->whereHas('timesheetshift', function ($query) use ($start_date, $end_date)
                               {
                                   $query->where(DB::raw('date(start_time)'), '>=', $start_date)
                                         ->where(DB::raw('date(start_time)'), '<=', $end_date);
                               })
                               ->with(array('timesheetshift.timesheetbreak' => function ($query) use ($start_date, $end_date)
                               {
                                   $query->where(DB::raw('date(start_time)'), '>=', $start_date)
                                         ->where(DB::raw('date(start_time)'), '<=', $end_date);
                               }))->get();

        if ($timesheets->isEmpty()) return 0;

        foreach ($timesheets as $timesheet)
        {
            foreach ($timesheet->timesheetshift as $shift)
            {
                $units_worked += $shift->number_of_units;
                foreach ($shift->timesheetbreak as $break)
                {
                    $units_worked -= $break->break_length / 60;
                }
            }
        }

        return $units_worked;
    }
}
