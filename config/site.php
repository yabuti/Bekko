<?php

return [
    'name' => 'Bekko Coffee',
    'tagline' => 'Good food, fresh juice and proper coffee.',
    'description' => 'A little neighbourhood spot for breakfast favourites, hearty lunches, fresh juice, burgers and the kind of coffee you think about later.',
    'currency' => 'ETB',

    // Menu categories available to staff when adding or editing a meal.
    'menu_categories' => ['breakfast', 'lunch', 'bites', 'drinks', 'fresh'],

    'hours' => [
        ['day' => 'Monday – Friday', 'time' => '8:00 AM – 9:00 PM'],
        ['day' => 'Saturday', 'time' => '9:00 AM – 10:00 PM'],
        ['day' => 'Sunday', 'time' => '9:00 AM – 1:00 PM · closed after 1:00 PM'],
    ],

    // TEMPORARY: replace with the real address and contact details.
    'address' => ['123 Main Street', 'Your Town'],
    'phone' => '+00 000 000 000',
    'email' => 'hello@bekkocoffee.com',
    'instagram' => '@bekkocoffee',
    'instagram_url' => 'https://instagram.com/',
];
