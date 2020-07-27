<?php

// Model:'City' - Database Table: 'City'
use Illuminate\Database\Eloquent\Model;
/**
 * City
 *
 * @property integer $id
 * @property string $city_name
 * @property string $country_name
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection|\Organisation[] $organisation
 * @property-read \Illuminate\Database\Eloquent\Collection|\User[] $user
 * @method static \Illuminate\Database\Query\Builder|\City whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\City whereCityName($value)
 * @method static \Illuminate\Database\Query\Builder|\City whereCountryName($value)
 * @method static \Illuminate\Database\Query\Builder|\City whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\City whereUpdatedAt($value)
 */
Class City extends Model
{

    protected $table='city';

    public function organisation()
    {
        return $this->hasMany('Organisation');
    }

    public function user()
    {
        return $this->hasMany('User');
    }

}