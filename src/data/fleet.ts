import { vehicleCategories, type Vehicle, type VehicleCategory } from './vehicleData'
import prado from '../assets/img/fleet-prado.jpg'
import lx570Suv from '../assets/img/fleet/lx570-suv.jpg'
import hilux from '../assets/img/fleet/hilux.jpg'
import landcruiser from '../assets/img/fleet/landcruiser.jpg'
import gx460 from '../assets/img/fleet/gx460.jpg'
import lx570Lux from '../assets/img/fleet/lx570-lux.jpg'
import landcruiserLux from '../assets/img/fleet/landcruiser-lux.jpg'
import gl550 from '../assets/img/fleet/gl550.jpg'
import s550 from '../assets/img/fleet/s550.jpg'
import rangeRover from '../assets/img/fleet/range-rover.jpg'
import gwagon from '../assets/img/fleet/gwagon.jpg'
import rolls from '../assets/img/fleet/rolls.jpg'
import camry from '../assets/img/fleet/camry.jpg'
import corolla from '../assets/img/fleet/corolla.jpg'
import avalon from '../assets/img/fleet/avalon.jpg'
import hiace from '../assets/img/fleet/hiace.jpg'
import coaster from '../assets/img/fleet/coaster.jpg'
import sprinter from '../assets/img/fleet/sprinter.jpg'

export interface FleetModel {
  id: string
  name: string
  categoryId: string
  /** Exact `Vehicle.label` strings from vehicleData.ts that this card groups. */
  labels: string[]
  /** Text removed from the front of each label to leave the year or variant. */
  prefix: string
  image: string
  focus?: string
  alt: string
  credit: { author: string; url: string; license: string }
}

const commons = (file: string) => `https://commons.wikimedia.org/wiki/File:${file}`

export const FLEET_MODELS: FleetModel[] = [
  // ── Premium SUV ──
  {
    id: 'prado',
    name: 'Toyota Land Cruiser Prado',
    categoryId: 'premium-suv',
    labels: ['Toyota Prado 2017 Model', 'Toyota Prado 2018 Model', 'Toyota Prado 2020 Upgraded', 'Toyota Prado 2020 Model'],
    prefix: 'Toyota Prado ',
    image: prado,
    alt: 'Black Toyota Land Cruiser Prado on a city street',
    credit: { author: 'Ethan Llamas', url: commons('Toyota_Land_Cruiser_Prado_VX_black_diplomatic.jpg'), license: 'CC BY-SA 4.0' },
  },
  {
    id: 'landcruiser',
    name: 'Toyota Land Cruiser',
    categoryId: 'premium-suv',
    labels: ['Toyota Landcruiser 2015 Model', 'Toyota Landcruiser 2020 Upgraded', 'Toyota Landcruiser 2020 Model'],
    prefix: 'Toyota Landcruiser ',
    image: landcruiser,
    alt: 'Silver Toyota Land Cruiser 200, front three-quarter view',
    credit: { author: 'Dinkun Chen', url: commons('TOYOTA_LAND_CRUISER_(J200)_China_(7).jpg'), license: 'CC BY-SA 4.0' },
  },
  {
    id: 'gx460',
    name: 'Lexus GX 460',
    categoryId: 'premium-suv',
    labels: ['Lexus GX 460 2019 Model'],
    prefix: 'Lexus GX 460 ',
    image: gx460,
    alt: 'Black Lexus GX 460, front three-quarter view',
    credit: { author: 'Ethan Llamas', url: commons('Lexus_GX_460_URJ150_FL2_Black_Onyx.jpg'), license: 'CC BY-SA 4.0' },
  },
  {
    id: 'lx570-suv',
    name: 'Lexus LX 570',
    categoryId: 'premium-suv',
    labels: ['Lexus LX 570 2014 Model'],
    prefix: 'Lexus LX 570 ',
    image: lx570Suv,
    alt: 'Black Lexus LX 570, front three-quarter view',
    credit: { author: 'Dinkun Chen', url: commons('LEXUS_LX_570_(J200)_China_(4).jpg'), license: 'CC BY-SA 4.0' },
  },
  {
    id: 'hilux',
    name: 'Toyota Hilux',
    categoryId: 'premium-suv',
    labels: ['Toyota Hilux 2014 Model', 'Toyota Hilux 2020 Model', 'Toyota Hilux 2024 Model'],
    prefix: 'Toyota Hilux ',
    image: hilux,
    alt: 'Silver Toyota Hilux double cab pickup, front three-quarter view',
    credit: { author: 'Captainmorlypogi1959', url: commons('Toyota_Hilux_4x2_E_2021.jpg'), license: 'CC BY-SA 4.0' },
  },

  // ── Luxury ──
  {
    id: 'landcruiser-lux',
    name: 'Toyota Land Cruiser 300',
    categoryId: 'luxury',
    labels: ['Toyota Landcruiser 2025 Model', 'Toyota Landcruiser Armored / Bulletproof'],
    prefix: 'Toyota Landcruiser ',
    image: landcruiserLux,
    alt: 'White Toyota Land Cruiser 300, front three-quarter view',
    credit: { author: 'TTTNIS', url: commons('2021_Toyota_Land_Cruieser_300_ZX.jpg'), license: 'CC0' },
  },
  {
    id: 'lx570-lux',
    name: 'Lexus LX 570',
    categoryId: 'luxury',
    labels: ['Lexus LX 570 2020 Model'],
    prefix: 'Lexus LX 570 ',
    image: lx570Lux,
    alt: 'Black Lexus LX 570 with the spindle grille, front three-quarter view',
    credit: { author: 'Alexander Migl', url: commons('Lexus_LX_570_(URJ201W)_IMG_4913.jpg'), license: 'CC BY-SA 4.0' },
  },
  {
    id: 'gl550',
    name: 'Mercedes-Benz GL 550',
    categoryId: 'luxury',
    labels: ['Benz GL 550 2015 Model'],
    prefix: 'Benz GL 550 ',
    image: gl550,
    alt: 'Dark grey Mercedes-Benz GL-Class SUV, front three-quarter view',
    credit: { author: 'Navigator84', url: commons('Mercedes-Benz_GL_X166_France_2013-03-23.jpg'), license: 'CC BY-SA 3.0' },
  },
  {
    id: 's550',
    name: 'Mercedes-Benz S 550',
    categoryId: 'luxury',
    labels: ['Benz S550'],
    prefix: 'Benz S550',
    image: s550,
    alt: 'Black Mercedes-Benz S-Class saloon, front three-quarter view',
    credit: { author: 'Damian B Oh', url: commons('Mercedes-Benz_W222_S_500_Black_(1).jpg'), license: 'CC BY-SA 4.0' },
  },
  {
    id: 'range-rover',
    name: 'Range Rover',
    categoryId: 'luxury',
    labels: ['Range Rover 2020', 'Range Rover'],
    prefix: 'Range Rover',
    image: rangeRover,
    alt: 'Black Range Rover Autobiography, front three-quarter view',
    credit: {
      author: 'Damian B Oh',
      url: commons('Land_Rover_Range_Rover_Autobiography_L405_Santorini_Black_(1).jpg'),
      license: 'CC BY-SA 4.0',
    },
  },
  {
    id: 'gwagon',
    name: 'Mercedes-AMG G 63',
    categoryId: 'luxury',
    labels: ['G-Wagon Benz 2023'],
    prefix: 'G-Wagon Benz ',
    image: gwagon,
    alt: 'Black Mercedes-AMG G 63, front three-quarter view',
    credit: { author: 'Mircea Ioan', url: commons('2020-01-19_Black_Mercedes_G63_AMG_(49774824142).jpg'), license: 'CC BY 2.0' },
  },
  {
    id: 'rolls',
    name: 'Rolls-Royce Phantom',
    categoryId: 'luxury',
    labels: ['Rolls Royce'],
    prefix: 'Rolls Royce',
    image: rolls,
    alt: 'Black Rolls-Royce Phantom, front three-quarter view',
    credit: { author: 'Alexander-93', url: commons('Rolls-Royce_Phantom_VIII_Series_I_IMG_9101.jpg'), license: 'CC BY-SA 4.0' },
  },

  // ── Economy ──
  {
    id: 'camry',
    name: 'Toyota Camry',
    categoryId: 'economy',
    labels: ['Toyota Camry 2014 Model', 'Toyota Camry 2016 Model'],
    prefix: 'Toyota Camry ',
    image: camry,
    alt: 'Black Toyota Camry saloon on the road',
    credit: {
      author: 'OWS Photography',
      url: commons('Toyota_Camry_(XV50)_Washington_DC_Metro_Area,_USA_(1).jpg'),
      license: 'CC BY 4.0',
    },
  },
  {
    id: 'corolla',
    name: 'Toyota Corolla',
    categoryId: 'economy',
    labels: ['Toyota Corolla 2015'],
    prefix: 'Toyota Corolla ',
    image: corolla,
    alt: 'Grey Toyota Corolla saloon at a crossing',
    credit: {
      author: 'OWS Photography',
      url: commons('Toyota_Corolla_(E170)_Washington_DC_Metro_Area,_USA.jpg'),
      license: 'CC BY 4.0',
    },
  },
  {
    id: 'avalon',
    name: 'Toyota Avalon',
    categoryId: 'economy',
    labels: ['Toyota Avalon 2015 Model'],
    prefix: 'Toyota Avalon ',
    image: avalon,
    alt: 'Pearl white Toyota Avalon saloon, front three-quarter view',
    credit: { author: 'Alexander Migl', url: commons('Toyota_Avalon_XX40.jpg'), license: 'CC BY-SA 4.0' },
  },

  // ── Bus / Van ──
  {
    id: 'hiace',
    name: 'Toyota HiAce',
    categoryId: 'bus-van',
    labels: [
      'Toyota Hiace Bus Flat Roof',
      'Toyota Hiace Bus High Roof Executive',
      'Toyota Hiace Bus High Roof Executive 2021',
    ],
    prefix: 'Toyota Hiace Bus ',
    image: hiace,
    alt: 'Toyota HiAce high roof minibus, front three-quarter view',
    credit: { author: 'Dinkun Chen', url: commons('TOYOTA_HIACE_COMMUTER_(H200)_China.jpg'), license: 'CC BY-SA 4.0' },
  },
  {
    id: 'coaster',
    name: 'Toyota Coaster',
    categoryId: 'bus-van',
    labels: ['Toyota Coaster Bus (New Model)'],
    prefix: 'Toyota Coaster Bus ',
    image: coaster,
    alt: 'Champagne and black Toyota Coaster bus, front three-quarter view',
    credit: { author: 'Ypy31', url: commons('Toyota_Coaster_EX_XZB70.jpg'), license: 'CC0' },
  },
  {
    id: 'sprinter',
    name: 'Mercedes-Benz Sprinter',
    categoryId: 'bus-van',
    labels: ['Mercedes Benz Sprinter Bus'],
    prefix: 'Mercedes Benz Sprinter Bus',
    image: sprinter,
    alt: 'Black Mercedes-Benz Sprinter executive van, front three-quarter view',
    credit: {
      author: 'Damian B Oh',
      url: commons('Mercedes-Benz_VS30_Sprinter_Tourer_319_CDI_Jet_Black_(1).jpg'),
      license: 'CC BY-SA 4.0',
    },
  },
]

/** Tab order in the Fleet section. */
export const FLEET_TABS = ['premium-suv', 'luxury', 'economy', 'bus-van'] as const

export interface FleetCard extends FleetModel {
  variants: Vehicle[]
  variantLine: string
  fromPrice: string
}

function variantName(label: string, prefix: string) {
  return label
    .slice(label.startsWith(prefix) ? prefix.length : 0)
    .replace(/ Model$/, '')
    .replace(/[()]/g, '')
    .trim()
}

export function categoryById(id: string): VehicleCategory | undefined {
  return vehicleCategories.find((c) => c.id === id)
}

/**
 * Joins the photographed models with the priced vehicles used by the booking
 * drawer, so the Fleet section never shows a price the booking would not.
 * A model whose labels no longer match anything is dropped rather than shown wrong.
 */
export function modelsFor(categoryId: string): FleetCard[] {
  const category = categoryById(categoryId)
  if (!category) return []
  return FLEET_MODELS.filter((m) => m.categoryId === categoryId).flatMap((m) => {
    const variants = category.vehicles.filter((v) => m.labels.includes(v.label))
    if (variants.length === 0) return []
    const from = Math.min(...variants.map((v) => v.priceValue))
    const names = variants.map((v) => variantName(v.label, m.prefix))
    // A bare label ("Range Rover") has no year to show; listing only the other
    // variants would wrongly suggest that is all there is, so show none.
    const variantLine = names.some((n) => !n) ? '' : names.sort((a, b) => a.localeCompare(b)).join('  ·  ')
    return [{ ...m, variants, variantLine, fromPrice: `₦${from.toLocaleString('en-NG')}` }]
  })
}
