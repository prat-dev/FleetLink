/**
 * @jest-environment node
 */
import {getRideEstimateAndVehicles} from './actions';
import {estimateRideDuration} from '@/ai/flows/route-duration-estimation';

// Mock the AI flow
jest.mock('@/ai/flows/route-duration-estimation', () => ({
  estimateRideDuration: jest.fn(),
}));

const mockedEstimateRideDuration = estimateRideDuration as jest.Mock;

describe('getRideEstimateAndVehicles', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockedEstimateRideDuration.mockClear();
  });

  it('should return available vehicles and estimation for valid input', async () => {
    const prevState = {};
    const formData = new FormData();
    formData.append('origin', '110001');
    formData.append('destination', '400050');
    formData.append('capacity', '4');
    formData.append('startTime', '10:00');

    const mockEstimation = {
      estimatedDurationMinutes: 120,
      explanation: 'The ride is estimated to take 2 hours based on moderate traffic.',
    };
    mockedEstimateRideDuration.mockResolvedValue(mockEstimation);

    const result = await getRideEstimateAndVehicles(prevState, formData);

    expect(mockedEstimateRideDuration).toHaveBeenCalledWith({
      origin: '110001',
      destination: '400050',
      timeOfTravel: '10:00',
      trafficConditions: 'moderate',
    });
    expect(result.results).toBeDefined();
    expect(result.results!.length).toBeGreaterThan(0);
    expect(result.results![0].estimation).toEqual(mockEstimation);
    expect(result.error).toBeUndefined();
    expect(result.message).toBeUndefined();
  });

  it('should return only estimation if no vehicles match capacity', async () => {
    const prevState = {};
    const formData = new FormData();
    formData.append('origin', '110001');
    formData.append('destination', '400050');
    formData.append('capacity', '20'); // High capacity to ensure no vehicle matches
    formData.append('startTime', '11:00');

    const mockEstimation = {
      estimatedDurationMinutes: 130,
      explanation: 'The ride is estimated to take 2 hours and 10 minutes.',
    };
    mockedEstimateRideDuration.mockResolvedValue(mockEstimation);

    const result = await getRideEstimateAndVehicles(prevState, formData);

    expect(result.message).toBe('No vehicles found matching your criteria, but we can still estimate the duration.');
    expect(result.results).toBeDefined();
    expect(result.results!.length).toBe(1);
    expect(result.results![0].estimation).toEqual(mockEstimation);
    expect(result.results![0].id).toBeUndefined(); // It's just an estimation, not a vehicle
    expect(result.error).toBeUndefined();
  });

  it('should return an error for invalid form data', async () => {
    const prevState = {};
    const formData = new FormData();
    formData.append('origin', '1'); // Invalid origin
    formData.append('destination', '400050');
    formData.append('capacity', '4');
    formData.append('startTime', '10:00');

    const result = await getRideEstimateAndVehicles(prevState, formData);

    expect(result.error).toBe('Invalid form data. Please check your inputs.');
    expect(result.results).toEqual([]);
    expect(mockedEstimateRideDuration).not.toHaveBeenCalled();
  });

  it('should handle errors from the AI estimation flow gracefully', async () => {
    const prevState = {};
    const formData = new FormData();
    formData.append('origin', '110001');
    formData.append('destination', '400050');
    formData.append('capacity', '4');
    formData.append('startTime', '10:00');

    mockedEstimateRideDuration.mockRejectedValue(new Error('AI service unavailable'));

    const result = await getRideEstimateAndVehicles(prevState, formData);

    expect(result.error).toBe('Failed to get ride estimation. Please try again later.');
    expect(result.results).toEqual([]);
  });
});
