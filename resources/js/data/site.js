// All the text that appears around the site lives here.
// Change these values and the website updates everywhere.

export const site = {
  // Placeholder — update when the real cafe name is confirmed.
  name: 'Bekko Coffee',
  tagline: 'Good food, fresh juice and proper coffee.',
  description:
    'A little neighbourhood spot for breakfast favourites, hearty lunches, fresh juice, burgers and the kind of coffee you think about later.',
  currency: 'ETB',

  hours: [
    {
      day: 'Monday – Friday',
      time: '8:00 AM – 9:00 PM',
      dayKey: 'weekday',
      timeKey: 'weekdayTime',
      days: [1, 2, 3, 4, 5],
      openMinutes: 8 * 60,
      closeMinutes: 21 * 60,
    },
    {
      day: 'Saturday',
      time: '9:00 AM – 10:00 PM',
      dayKey: 'saturday',
      timeKey: 'saturdayTime',
      days: [6],
      openMinutes: 9 * 60,
      closeMinutes: 22 * 60,
    },
    {
      day: 'Sunday',
      time: '9:00 AM – 1:00 PM · closed after 1:00 PM',
      dayKey: 'sunday',
      timeKey: 'sundayTime',
      days: [0],
      openMinutes: 9 * 60,
      closeMinutes: 13 * 60,
    },
  ],

  // Placeholder — update with the real address when available.
  address: ['123 Main Street', 'Your Town'],
  phone: '+00 000 000 000',
  email: 'hello@bekkocoffee.com',
  instagram: '@bekkocoffee',
  instagramUrl: 'https://instagram.com/',
}

export const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  site.address.join(', '),
)}`
