<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use \App\Models\Roster\Feature;

class MakeFeatures extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'make:feature';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        foreach(\Config::get('features') as $name => $description) {
            $feature = Feature::firstOrNew(['feature_key' => str_slug(strtolower($name), '_')]);//$feature->feature_key = str_slug(strtolower($feature->name), '_')
            $feature->feature_key = str_slug(strtolower($name), '_');
            $feature->name = $name;
            $feature->description = $description;
            $feature->save();
        }
        $this->info('Make features finished.');
    }
}
