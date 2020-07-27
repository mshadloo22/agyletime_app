<?php

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;
use \App\Models\Roster;

class DatabaseSeeder extends Seeder {

	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
		Eloquent::unguard();

		/**
		 * Firstly Uncomment this part and seed
		 */
		\App\Models\Roster\Feature::create(array(
			'feature_key' => 'timesheets',
			'name' => 'Timesheets',
			'description' => 'This is a timesheet description'
		));

//        City::create(array(
//            'city_name' => 'Melbourne',
//            'country_name' => 'Australia'
//            ));
//        PaymentInfo::create(array(
//        ));
//        Plan::create(array(
//            'name' => 'testplan'
//            ));
//        NotificationPreference::create(array(
//            'name'=> 'testpreference'
//            ));
//        MessageNotificationPreference::create(array(
//            'name'=> 'testpreference'
//        ));
//        Organisation::create(array(
//            'name'=> 'Qk Services',
//            'address' => '70 Robertson Street',
//            'post_code' => '3031',
//            'city_id' => '1',
//            'plan_id' => '1',
//            'payment_info_id' => '1',
//		    'timezone' => 'Australia/Melbourne',
//            'api_token' => 'MTlaNGgbnj157n4fnUIOpJaCWCdInHbafaAUIgzbS5lDjmvJU7Z1u3rL5L5SzAX4Yi3PVSddgoyn6y0kvNBoPmDRQvJonF1ajqdtfh9s0rdOlhGWa0NkiQShAdyxzplF'
//        ));
//
//		Site::create(array(
//			'name' => 'QK Site',
//			'description' => 'QK Site Description',
//			'organisation_id' => '1',
//			'city_id' => '1'
//		));
//		EmploymentRulesTemplate::create(array(
//			'name' => 'QK Service Template',
//			'organisation_id' => '1'
//		));
//
//		Partner::create(array(
//			'name' => 'QK Partner',
//			'organisation_id' => '1'
//		));
//		Campaign::create(array(
//			'name' => 'QK Campaign',
//			'organisation_id' => '1',
//			'partner_id' => '1',
//		));
//		Team::create(array(
//			'name' => 'Beta_TEAM_1',
//			'organisation_id' => '1',
//			'campaign_id' => '1'
//		));




		/**
		 * Uncomment this part and seed after the first seeding finished.
		 */
//		\App\Models\Roster\User::create(array(
//			'email' => 'tli@qk.com.au',
//			'password' => Hash::make('asdfasdf'),
//			'first_name' => 'Mike',
//			'last_name' => 'Li',
//			'phone_one' => '0413313043',
//			'notification_preference_id' => '1',
//			'message_notification_id' => '1',
//			'primary_contact' => '1',
//			'city_id' => '1',
//			'organisation_id' => '1',
//			'timezone' => '1',
//			'remember_token' => '0',
//			'site_id' => '1',
//			'employment_rules_template_id' => '1',
//			'team_id' => '1'
//		));


	}

}
