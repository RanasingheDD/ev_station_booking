export interface Charger {
  id: string;
  connectorType: string; // CCS, CHAdeMO, Type2 etc.
  maxPowerKw: number; // kW
  status: string; // Available / Charging / Offline
}

export interface TariffRule {
  id: string;
  pricePerKwh: number;
  description?: string;
}

export interface Station {
  id: string;
  name: string;
  type: string; // AC / DC / Fast Charger etc.
  price: number; // default price (optional)
  slot: number; // Available slots
  distance?: number; // for listing
  distanceDisplay?: string; // “2.3 km away”

  address: string;
  lat: number;
  lng: number;

  images: string[]; // gallery
  description?: string;
  operatorName?: string;

  open: boolean;
  openTime?: string;
  closeTime?: string;

  rating?: number;
  amenities: string[];

  chargers: Charger[];
  tariffRules?: TariffRule[];
}
