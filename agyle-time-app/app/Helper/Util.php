<?php
namespace app\Helper;


class Util
{
    public static function mempty(){
        foreach(func_get_args() as $arg)
            if(empty($arg))
                return true;
            else
                continue;
        return false;
    }
}