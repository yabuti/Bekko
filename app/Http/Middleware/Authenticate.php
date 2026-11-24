<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate extends Middleware
{
    /**
     * Send unauthenticated staff visitors to the staff sign-in page.
     */
    protected function redirectTo($request): ?string
    {
        return route('staff.login');
    }
}
