'use server';

import {z} from 'zod';
import {estimateRideDuration} from '@/ai/flows/route-duration-estimation';
import type {SearchResult, Vehicle} from '@/lib/types';

const searchSchema = z.object({
  origin: z.string().min(3, 'Origin pincode is required.'),
  destination: z.string().min(3, 'Destination pincode is required.'),
  capacity: z.coerce.number().min(1, 'Capacity must be at least 1.'),
  startTime: z.string().min(1, 'Start time is required.'),
});

// Mock database of vehicles
const allVehicles: Vehicle[] = [
  {
    id: 1,
    type: 'Sedan',
    capacity: 4,
    driver: {name: 'Ramesh', rating: 4.8},
    imageUrl: 'https://picsum.photos/600/400?random=1',
  },
  {
    id: 2,
    type: 'SUV',
    capacity: 6,
    driver: {name: 'Suresh', rating: 4.9},
    imageUrl: 'https://picsum.photos/600/400?random=2',
  },
  {
    id: 3,
    type: 'Van',
    capacity: 10,
    driver: {name: 'Ganesh', rating: 4.7},
    imageUrl: 'https://picsum.photos/600/400?random=3',
  },
  {
    id: 4,
    type: 'Sedan',
    capacity: 4,
    driver: {name: 'Mahesh', rating: 4.6},
    imageUrl: 'https://picsum.photos/600/400?random=4',
  },
  {
    id: 5,
    type: 'SUV',
    capacity: 7,
    driver: {name: 'Rajesh', rating: 5.0},
    imageUrl: 'https://picsum.photos/600/400?random=5',
  },
];

export async function getRideEstimateAndVehicles(prevState: any, formData: FormData) {
  const validatedFields = searchSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      error: 'Invalid form data. Please check your inputs.',
      results: [],
    };
  }

  const {origin, destination, capacity, startTime} = validatedFields.data;

  try {
    const estimation = await estimateRideDuration({
      origin,
      destination,
      timeOfTravel: startTime,
      trafficConditions: 'moderate', // Mocking traffic conditions
    });

    // Mock vehicle filtering
    const availableVehicles = allVehicles.filter(vehicle => vehicle.capacity >= capacity);

    const results: SearchResult[] = availableVehicles.map(vehicle => ({
      ...vehicle,
      estimation,
    }));

    if (results.length === 0) {
      return {
        message: 'No vehicles found matching your criteria, but we can still estimate the duration.',
        results: [{estimation}],
      };
    }

    return {results};
  } catch (e) {
    console.error(e);
    return {
      error: 'Failed to get ride estimation. Please try again later.',
      results: [],
    };
  }
}
