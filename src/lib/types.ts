import type {RouteDurationEstimationOutput} from '@/ai/flows/route-duration-estimation';

export interface Vehicle {
  id: number;
  type: 'Sedan' | 'SUV' | 'Van';
  capacity: number;
  driver: {
    name: string;
    rating: number;
  };
  imageUrl: string;
}

export interface SearchResult extends Vehicle {
  estimation: RouteDurationEstimationOutput;
}
