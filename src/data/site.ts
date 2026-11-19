import lekkiBridge from '../assets/img/lekki-bridge.jpg'
import lekkiNight from '../assets/img/lekki-night.jpg'
import asoRock from '../assets/img/aso-rock.jpg'
import zumaRock from '../assets/img/zuma-rock.jpg'
import lagosMarina from '../assets/img/lagos-marina.jpg'
import abujaMosque from '../assets/img/abuja-mosque.jpg'
import millenniumPark from '../assets/img/millennium-park.jpg'
import tarkwaBay from '../assets/img/tarkwa-bay.jpg'
import nikeGallery from '../assets/img/nike-gallery.jpg'
import lekkiConservation from '../assets/img/lekki-conservation.jpg'
import airport from '../assets/img/airport.jpg'
import fleetPrado from '../assets/img/fleet/prado.jpg'
import chauffeurSuv from '../assets/img/chauffeur-prado.jpg'
import chauffeurDoor from '../assets/img/service-chauffeur-door.jpg'
import stepIn from '../assets/img/experience-door-chauffeur.jpg'
import backseat from '../assets/img/experience-window-lagos.jpg'
import arrivals from '../assets/img/experience-arrivals-terminal.jpg'
import nokAlara from '../assets/img/nok-alara.jpg'
import diningLagosEvening from '../assets/img/dining-lagos-evening.jpg'
import diningAbuja from '../assets/img/dining-abuja.jpg'
import diningAbuja2 from '../assets/img/dining-abuja-2.jpg'

export const BRAND = {
  name: 'Perficient',
  fullName: 'Perficient Services',
  phone: '+234 805 270 2261',
  phoneHref: 'tel:+2348052702261',
  phoneAlt: '+234 810 663 6311',
  phoneAltHref: 'tel:+2348106636311',
  whatsapp: '2348052702261',
  email: 'perficientlogisticsltd@gmail.com',
}

export const img = {
  lekkiBridge,
  lekkiNight,
  asoRock,
  zumaRock,
  lagosMarina,
  abujaMosque,
  millenniumPark,
  tarkwaBay,
  nikeGallery,
  lekkiConservation,
  airport,
  fleetPrado,
  chauffeurSuv,
}

export type ServiceId = 'chauffeur' | 'airport' | 'protocol' | 'interstate' | 'tours' | 'rental'

export interface Service {
  id: ServiceId
  numeral: string
  title: string
  short: string
  line: string
  body: string
  image: string
  focus?: string
}

export interface Place {
  name: string
  kind: string
  verb?: string
  note: string
  image: string
  // Used to prefill the drop-off when a guest plans a trip to this place.
  // Addresses and coordinates come from Google Places (looked up Nov 2026).
  address: string
  coords: { lat: number; lon: number }
}

export interface City {
  name: string
  tagline: string
  intro: string
  hero: string
  airport: string
  places: Place[]
}

export type CityName = 'Abuja' | 'Lagos'

export const SERVICES: Service[] = [
  {
    id: 'chauffeur',
    numeral: 'I',
    title: 'Personal Chauffeur',
    short: 'Chauffeur',
    line: 'A dedicated driver for the hour, the day or the season.',
    body: 'Meetings, dinners, school runs and late returns. Your chauffeur learns your rhythm, so the city simply bends around your day.',
    image: chauffeurDoor,
    // Wide photo in a 4:5 frame: keep the chauffeur and the open, lit door in view.
    focus: '55% 50%',
  },
  {
    id: 'airport',
    numeral: 'II',
    title: 'Airport Shuttle',
    short: 'Airport',
    line: 'Met at arrivals. Flight tracked. Never kept waiting.',
    body: 'Meet and greet at Nnamdi Azikiwe and Murtala Muhammed. We follow your flight in real time, handle your luggage and have the cabin cooled before you land.',
    image: airport,
  },
  {
    id: 'protocol',
    numeral: 'III',
    title: 'Escort and Protocol',
    short: 'Protocol',
    line: 'Discreet movement for dignitaries and delegations.',
    body: 'Convoy planning, trained protocol officers, advance route checks and liaison with venues and security details. Quiet, precise and entirely confidential.',
    image: asoRock,
  },
  {
    id: 'interstate',
    numeral: 'IV',
    title: 'Inter-State Travel',
    short: 'Inter-state',
    line: 'City to city, in the comfort of a private cabin.',
    body: 'Experienced highway chauffeurs, planned rest stops and a team monitoring your route from departure to arrival.',
    image: lagosMarina,
  },
  {
    id: 'tours',
    numeral: 'V',
    title: 'VIP Trips and Tours',
    short: 'VIP tours',
    line: 'Your chauffeur, your local insider.',
    body: 'Galleries, waterfronts, markets, rocks and the tables locals keep to themselves. Curated days out, shaped around what you love.',
    image: nikeGallery,
  },
  {
    id: 'rental',
    numeral: 'VI',
    title: 'Car Hire',
    short: 'Car hire',
    line: 'Your own SUV and chauffeur, by the day or the week.',
    body: 'Toyota Prado, Land Cruiser, Lexus, Mercedes-Benz and more, always chauffeur driven. Spotless, air conditioned and fully insured, for as long as you are in town.',
    image: fleetPrado,
  },
]

export const CITIES: Record<CityName, City> = {
  Abuja: {
    name: 'Abuja',
    tagline: 'The capital, composed.',
    intro:
      'Wide boulevards, granite giants and evenings that unfold slowly. Abuja rewards the traveller who knows where to look, and who never has to worry about the drive.',
    hero: abujaMosque,
    airport: 'Nnamdi Azikiwe International (ABV)',
    places: [
      {
        name: 'Aso Rock',
        kind: 'Landmark',
        note: 'The 400 metre monolith that watches over the capital. Best seen in the soft gold of late afternoon.',
        image: asoRock,
        address: 'Aso Rock, Asokoro, Abuja',
        coords: { lat: 9.087, lon: 7.53003 },
      },
      {
        name: 'National Mosque',
        kind: 'Architecture',
        note: 'Golden domes and four minarets along Independence Avenue. A quiet stop of real grandeur.',
        image: abujaMosque,
        address: 'Abuja National Mosque, 1012 Sani Abacha Way, Central Business District, Abuja',
        coords: { lat: 9.06002, lon: 7.48992 },
      },
      {
        name: 'Nola',
        kind: 'Dining',
        verb: 'Dinner at',
        note: 'Candlelit Italian in Wuse 2, made for long dinners. We drop you at the door and wait however late it runs.',
        image: diningAbuja,
        address: 'Nola Restaurant and Bar, 9 Kampala Street, Wuse 2, Abuja',
        coords: { lat: 9.078, lon: 7.48093 },
      },
      {
        name: 'Millennium Park',
        kind: 'Leisure',
        note: 'Abuja’s green heart. Water gardens and long shaded walks, a short glide from the Central Business District.',
        image: millenniumPark,
        address: 'Millennium Park, 5 Usuma Street, Three Arms Zone, Abuja',
        coords: { lat: 9.07074, lon: 7.49968 },
      },
      {
        name: 'Wakkis',
        kind: 'Dining',
        verb: 'Dinner at',
        note: 'A long-standing Abuja favourite for rich, slow-cooked Indian food. An easy evening, and no thought for parking.',
        image: diningAbuja2,
        address: 'Wakkis, 171 Aminu Kano Crescent, Wuse 2, Abuja',
        coords: { lat: 9.08153, lon: 7.47674 },
      },
      {
        name: 'Zuma Rock',
        kind: 'Day trip',
        note: 'The famous face on the road north. A scenic drive out of the city with a chauffeur who knows every stop.',
        image: zumaRock,
        address: 'Zuma Rock, Madalla, Niger State',
        coords: { lat: 9.12556, lon: 7.22889 },
      },
    ],
  },
  Lagos: {
    name: 'Lagos',
    tagline: 'The city that never lowers its voice.',
    intro:
      'Lagos is energy, art, water and appetite. We take the traffic, the timing and the parking off your hands, so all that is left is the city itself.',
    hero: lekkiBridge,
    airport: 'Murtala Muhammed International (LOS)',
    places: [
      {
        name: 'Lekki Ikoyi Link Bridge',
        kind: 'Landmark',
        note: 'The city’s signature silhouette. Cross it at dusk, when the cables light up over the lagoon.',
        image: lekkiNight,
        address: 'Lekki-Ikoyi Link Bridge, Lagos',
        coords: { lat: 6.45016, lon: 3.45538 },
      },
      {
        name: 'NOK by Alara',
        kind: 'Dining',
        verb: 'Dinner at',
        note: 'Contemporary African cooking in Victoria Island, and one of the city’s most celebrated tables. Book ahead; we handle the rest.',
        image: nokAlara,
        address: 'NOK by Alara, 12A Akin Olugbade Street, Victoria Island, Lagos',
        coords: { lat: 6.43062, lon: 3.42135 },
      },
      {
        name: 'Nike Art Gallery',
        kind: 'Art',
        note: 'Four floors of Nigerian art, from textiles to canvas. Leave time; most guests stay longer than planned.',
        image: nikeGallery,
        address: 'Nike Art Gallery, 2 Nike Art Gallery Road, Lekki Phase 1, Lagos',
        coords: { lat: 6.43151, lon: 3.48184 },
      },
      {
        name: 'Tarkwa Bay',
        kind: 'Waterside',
        note: 'Sheltered sand and calm water, a short boat ride away. We handle the drive to the jetty and the wait.',
        image: tarkwaBay,
        address: 'Tarzan Boats and Jetty (boats to Tarkwa Bay), Foreshore Road, Lekki Phase 1, Lagos',
        coords: { lat: 6.43657, lon: 3.44645 },
      },
      {
        name: 'RSVP',
        kind: 'Dining',
        verb: 'Evening at',
        note: 'Cocktails, good music and a crowd worth dressing up for in Victoria Island. Your chauffeur is outside when the night ends.',
        image: diningLagosEvening,
        address: 'RSVP, 9 Eletu Ogabi Street, Victoria Island, Lagos',
        coords: { lat: 6.42842, lon: 3.42152 },
      },
      {
        name: 'Lekki Conservation Centre',
        kind: 'Nature',
        note: 'Walk the treetops on one of Africa’s longest canopy walkways, a green escape minutes from Lekki. Go early, before the heat.',
        image: lekkiConservation,
        address: 'Lekki Conservation Centre, Km 19 Lekki-Epe Expressway, Lekki, Lagos',
        coords: { lat: 6.44152, lon: 3.53577 },
      },
    ],
  },
}

export const DAY = [
  { time: '06:40', title: 'Wheels down at ABV', text: 'Your chauffeur is at arrivals with your name and a chilled bottle of water. Bags handled.' },
  { time: '09:30', title: 'The first meeting', text: 'Delivered to the door in the Central Business District, refreshed, ahead of time.' },
  { time: '13:00', title: 'Lunch with a view', text: 'A table your chauffeur suggested, because that is part of the job.' },
  { time: '16:45', title: 'Aso Rock at golden hour', text: 'A short detour between appointments. The kind of moment you remember the city for.' },
  { time: '20:00', title: 'Dinner, then home', text: 'Unhurried. Your car is waiting whenever you are ready, however late that is.' },
]

export const FLEET = {
  lede: 'From city sedans to armoured Land Cruisers and executive buses, each with a vetted chauffeur at the wheel.',
  points: [
    'Professionally trained, background checked chauffeurs',
    'Hourly, daily and multi day arrangements',
    'Air conditioned, with water, chargers and Wi-Fi on board',
    'Route planning and live trip monitoring',
  ],
}

// The guest's side of the journey, so visitors can picture themselves in it.
export const EXPERIENCE: { title: string; text: string; image: string; focus?: string; alt: string }[] = [
  {
    title: 'The door, held.',
    text: 'Your chauffeur is waiting before you are. Step in and the day is already handled.',
    image: stepIn,
    alt: 'A chauffeur in a black suit holding open the rear door of a black SUV for a guest outside a hotel entrance',
  },
  {
    title: 'The city at your window.',
    text: 'Cool air, quiet cabin, nowhere to be but where you are going.',
    image: backseat,
    alt: 'A woman in a patterned headwrap in the back seat at dusk, looking out at the lagoon and a lit bridge',
  },
  {
    title: 'Met at arrivals.',
    text: 'Your flight is tracked and your chauffeur is already waiting. From the terminal to the hotel lobby, your bags never leave our hands.',
    image: arrivals,
    // Wide photo in a 4:5 card: keep both travellers and the open SUV door in frame.
    focus: '54% 50%',
    alt: 'A chauffeur walking a guest with her suitcase across a rain-wet airport forecourt at night towards a black SUV with its door open',
  },
]

export const TESTIMONIALS = [
  {
    quote: 'They didn’t just drive us around Lagos. They showed us the Lagos we had been missing for years.',
    who: 'Adaeze O.',
    role: 'Returning from London',
  },
  {
    quote: 'Our delegation moved through Abuja for four days without a single minute lost. Discretion in every detail.',
    who: 'Chief of Staff',
    role: 'Visiting embassy delegation',
  },
  {
    quote: 'My flight landed two hours late. My chauffeur was still there, smiling, with the car cool and ready.',
    who: 'Tunde A.',
    role: 'Executive, oil and gas',
  },
]
