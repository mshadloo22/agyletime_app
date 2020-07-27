<?php

namespace App\Http\Middleware;

use Closure;

class SslMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        //The forwarded proto is from the load balancer, it tells us if the request is http or https,
        // we only want to force https on production
        if (!$request->server('HTTP_X_FORWARDED_PROTO')=='http' && env('APP_ENV') === 'production') {
            return redirect()->secure($request->getRequestUri());
        }

        return $next($request);
    }
}
