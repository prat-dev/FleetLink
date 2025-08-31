'use server';

import {z} from 'zod';
import {revalidatePath} from 'next/cache';
import {estimateRideDuration} from '@/ai/flows/route-duration-estimation';
import type {SearchResult, Vehicle, Booking} from '@/lib/types';
import {faker} from '@faker-js/faker';

const searchSchema = z.object({
  origin: z.string().min(3, 'Origin pincode is required.'),
  destination: z.string().min(3, 'Destination pincode is required.'),
  capacity: z.coerce.number().min(1, 'Capacity must be at least 1.'),
  startTime: z.string().min(1, 'Start time is required.'),
});

// Mock database of vehicles and bookings
let allVehicles: Vehicle[] = [
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

let bookings: Booking[] = [];

// Simulate creating a booking
export async function createBooking(vehicleId: number, startTime: string): Promise<Booking> {
  const vehicle = allVehicles.find(v => v.id === vehicleId);
  if (!vehicle) {
    throw new Error('Vehicle not found');
  }

  const newBooking: Booking = {
    id: faker.string.uuid(),
    vehicle,
    startTime,
    origin: faker.location.zipCode(),
    destination: faker.location.zipCode(),
    bookingTime: new Date().toISOString(),
  };

  bookings.push(newBooking);
  revalidatePath('/bookings');
  return newBooking;
}

// Simulate fetching all bookings
export async function getBookings(): Promise<Booking[]> {
  return bookings;
}

// Simulate deleting a booking
export async function deleteBooking(bookingId: string) {
  const initialLength = bookings.length;
  bookings = bookings.filter(b => b.id !== bookingId);
  if (bookings.length === initialLength) {
    throw new Error('Booking not found');
  }
  revalidatePath('/bookings');
  return {success: true};
}

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
      startTime,
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
