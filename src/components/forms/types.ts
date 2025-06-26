export interface Touched {
  address: boolean;
  postcode: boolean;
  city: boolean;
  surface: boolean;
  propertyType: boolean;
  rooms: boolean;
  firstname: boolean;
  lastname: boolean;
  email: boolean;
  phone: boolean;
  consent: boolean;
}

export interface AddressFeature {
  geometry: {
    coordinates: [number, number];
  };
  properties: {
    label: string;
    postcode?: string;
    city?: string;
  };
}
