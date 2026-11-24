<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class StaffAuthController extends Controller
{
    public function showLogin(): Response
    {
        return Inertia::render('Staff/Login');
    }

    public function login(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (! Auth::attempt($credentials)) {
            throw ValidationException::withMessages([
                'email' => 'Those details do not match our records.',
            ]);
        }

        $user = Auth::user();

        if (! in_array($user->role, ['waiter', 'kitchen', 'admin'], true)) {
            Auth::logout();

            throw ValidationException::withMessages([
                'email' => 'This account cannot access the staff dashboards.',
            ]);
        }

        $request->session()->regenerate();

        $dashboard = match ($user->role) {
            'kitchen' => route('staff.kitchen'),
            'admin' => route('staff.menu'),
            default => route('staff.waiter'),
        };

        return redirect()->intended($dashboard);
    }

    public function logout(Request $request): RedirectResponse
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('staff.login');
    }
}
