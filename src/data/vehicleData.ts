export interface Vehicle {
  label: string;
  price: string;
  priceValue: number;
}

export interface VehicleCategory {
  id: string;
  name: string;
  description: string;
  startingPrice: string;
  vehicles: Vehicle[];
}

export type PriceItem = {
  label: string;
  price: string;
};

// ── Category-based grouping (used by BookingForm wizard Step 2) ──

export const vehicleCategories: VehicleCategory[] = [
  {
    id: 'economy',
    name: 'Economy Sedan',
    description: 'Comfortable sedans for everyday city rides and airport transfers.',
    startingPrice: 'From ₦80,000',
    vehicles: [
      { label: 'Toyota Camry 2014 Model', price: '₦80,000', priceValue: 80000 },
      { label: 'Toyota Corolla 2015', price: '₦80,000', priceValue: 80000 },
      { label: 'Toyota Camry 2016 Model', price: '₦100,000', priceValue: 100000 },
      { label: 'Toyota Avalon 2015 Model', price: '₦100,000', priceValue: 100000 },
    ],
  },
  {
    id: 'premium-suv',
    name: 'Premium SUV',
    description: 'Spacious SUVs ideal for executive travel and family trips.',
    startingPrice: 'From ₦100,000',
    vehicles: [
      { label: 'Toyota Prado 2017 Model', price: '₦100,000', priceValue: 100000 },
      { label: 'Lexus LX 570 2014 Model', price: '₦100,000', priceValue: 100000 },
      { label: 'Toyota Hilux 2014 Model', price: '₦120,000', priceValue: 120000 },
      { label: 'Toyota Prado 2018 Model', price: '₦130,000', priceValue: 130000 },
      { label: 'Toyota Landcruiser 2015 Model', price: '₦150,000', priceValue: 150000 },
      { label: 'Toyota Prado 2020 Upgraded', price: '₦150,000', priceValue: 150000 },
      { label: 'Lexus GX 460 2019 Model', price: '₦160,000', priceValue: 160000 },
      { label: 'Toyota Hilux 2020 Model', price: '₦170,000', priceValue: 170000 },
      { label: 'Toyota Prado 2020 Model', price: '₦180,000', priceValue: 180000 },
      { label: 'Toyota Landcruiser 2020 Upgraded', price: '₦200,000', priceValue: 200000 },
      { label: 'Toyota Hilux 2024 Model', price: '₦250,000', priceValue: 250000 },
      { label: 'Toyota Landcruiser 2020 Model', price: '₦250,000', priceValue: 250000 },
    ],
  },
  {
    id: 'luxury',
    name: 'Luxury',
    description: 'Premium and exotic vehicles for VIP experiences and special occasions.',
    startingPrice: 'From ₦350,000',
    vehicles: [
      { label: 'Lexus LX 570 2020 Model', price: '₦350,000', priceValue: 350000 },
      { label: 'Benz GL 550 2015 Model', price: '₦550,000', priceValue: 550000 },
      { label: 'Toyota Landcruiser 2025 Model', price: '₦550,000', priceValue: 550000 },
      { label: 'Benz S550', price: '₦580,000', priceValue: 580000 },
      { label: 'Toyota Landcruiser Armored / Bulletproof', price: '₦700,000', priceValue: 700000 },
      { label: 'Range Rover 2020', price: '₦800,000', priceValue: 800000 },
      { label: 'Range Rover', price: '₦850,000', priceValue: 850000 },
      { label: 'G-Wagon Benz 2023', price: '₦1,500,000', priceValue: 1500000 },
      { label: 'Rolls Royce', price: '₦2,500,000', priceValue: 2500000 },
    ],
  },
  {
    id: 'bus-van',
    name: 'Bus / Van',
    description: 'Spacious buses and vans for group travel, events, and large parties.',
    startingPrice: 'From ₦130,000',
    vehicles: [
      { label: 'Toyota Hiace Bus Flat Roof', price: '₦130,000', priceValue: 130000 },
      { label: 'Toyota Hiace Bus High Roof Executive', price: '₦150,000', priceValue: 150000 },
      { label: 'Toyota Hiace Bus High Roof Executive 2021', price: '₦180,000', priceValue: 180000 },
      { label: 'Toyota Coaster Bus (New Model)', price: '₦200,000', priceValue: 200000 },
      { label: 'Mercedes Benz Sprinter Bus', price: '₦2,000,000', priceValue: 2000000 },
    ],
  },
];

// ── TermsPage-style grouping (used by TermsPage for display) ──

export const suvPrices: PriceItem[] = [
  { label: 'Toyota Landcruiser Armored / Bulletproof', price: '₦700,000' },
  { label: 'Toyota Landcruiser 2025 Model', price: '₦550,000' },
  { label: 'Toyota Landcruiser 2020 Model', price: '₦250,000' },
  { label: 'Toyota Landcruiser 2020 Upgraded', price: '₦200,000' },
  { label: 'Toyota Landcruiser 2015 Model', price: '₦150,000' },
  { label: 'Toyota Prado 2020 Model', price: '₦180,000' },
  { label: 'Toyota Prado 2020 Upgraded', price: '₦150,000' },
  { label: 'Toyota Prado 2018 Model', price: '₦130,000' },
  { label: 'Toyota Prado 2017 Model', price: '₦100,000' },
  { label: 'Lexus LX 570 2020 Model', price: '₦350,000' },
  { label: 'Lexus LX 570 2014 Model', price: '₦100,000' },
  { label: 'Lexus GX 460 2019 Model', price: '₦160,000' },
  { label: 'G-Wagon Benz 2023', price: '₦1,500,000' },
  { label: 'Range Rover 2020', price: '₦800,000' },
  { label: 'Toyota Hilux 2014 Model', price: '₦120,000' },
  { label: 'Toyota Hilux 2020 Model', price: '₦170,000' },
  { label: 'Toyota Hilux 2024 Model', price: '₦250,000' },
];

export const otherVehiclePrices: PriceItem[] = [
  { label: 'Range Rover', price: '₦850,000' },
  { label: 'Rolls Royce', price: '₦2,500,000' },
  { label: 'Mercedes Benz Sprinter Bus', price: '₦2,000,000' },
  { label: 'Benz S550', price: '₦580,000' },
  { label: 'Benz GL 550 2015 Model', price: '₦550,000' },
  { label: 'Toyota Camry 2016 Model', price: '₦100,000' },
  { label: 'Toyota Camry 2014 Model', price: '₦80,000' },
  { label: 'Toyota Avalon 2015 Model', price: '₦100,000' },
  { label: 'Toyota Corolla 2015', price: '₦80,000' },
];

export const busPrices: PriceItem[] = [
  { label: 'Toyota Hiace Bus High Roof Executive 2021', price: '₦180,000' },
  { label: 'Toyota Hiace Bus High Roof Executive', price: '₦150,000' },
  { label: 'Toyota Hiace Bus Flat Roof', price: '₦130,000' },
  { label: 'Toyota Coaster Bus (New Model)', price: '₦200,000' },
];
