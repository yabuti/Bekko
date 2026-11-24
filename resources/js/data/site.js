// All the text that appears around the site lives here.
// Change these values and the website updates everywhere.

export const site = {
  // TEMPORARY: change this if the folder name isn't the real cafe name.
  name: 'Bekko Coffee',
  tagline: 'Good food, fresh juice and proper coffee.',
  description:
    'A little neighbourhood spot for breakfast favourites, hearty lunches, fresh juice, burgers and the kind of coffee you think about later.',
  badge: 'Now open — come say hi',
  currency: 'ETB',

  hours: [
    { day: 'Monday – Friday', time: '8:00 AM – 9:00 PM' },
    { day: 'Saturday – Sunday', time: '9:00 AM – 10:00 PM' },
  ],

  // TEMPORARY: replace with the real address.
  address: ['123 Main Street', 'Your Town'],
  phone: '+00 000 000 000',
  email: 'hello@bekkocoffee.com',
  instagram: '@bekkocoffee',
  instagramUrl: 'https://instagram.com/',
}

export const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  site.address.join(', '),
)}`
