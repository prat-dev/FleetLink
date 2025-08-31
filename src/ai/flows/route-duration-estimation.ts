'use server';

/**
 * @fileOverview Estimates ride duration using AI based on the requested route and real-time traffic data.
 *
 * - estimateRideDuration - A function that estimates ride duration.
 * - RouteDurationEstimationInput - The input type for the estimateRideDuration function.
 * - RouteDurationEstimationOutput - The return type for the estimateRideDuration function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const RouteDurationEstimationInputSchema = z.object({
  origin: z.string().describe('The starting location of the route.'),
  destination: z.string().describe('The destination location of the route.'),
  trafficConditions: z.string().optional().describe('Real-time traffic conditions. Can be "heavy", "moderate", or "light".'),
  timeOfTravel: z.string().describe('The time of day when the ride will take place, in HH:mm format.'),
});
export type RouteDurationEstimationInput = z.infer<typeof RouteDurationEstimationInputSchema>;

const RouteDurationEstimationOutputSchema = z.object({
  estimatedDurationMinutes: z.number().describe('The estimated ride duration in minutes.'),
  explanation: z.string().describe('Explanation of how the duration was determined'),
});
export type RouteDurationEstimationOutput = z.infer<typeof RouteDurationEstimationOutputSchema>;

export async function estimateRideDuration(input: RouteDurationEstimationInput): Promise<RouteDurationEstimationOutput> {
  return estimateRideDurationFlow(input);
}

const routeDurationPrompt = ai.definePrompt({
  name: 'routeDurationPrompt',
  input: {schema: RouteDurationEstimationInputSchema},
  output: {schema: RouteDurationEstimationOutputSchema},
  prompt: `You are an expert in estimating ride durations. Consider the following information to estimate the ride duration in minutes:

Origin: {{{origin}}}
Destination: {{{destination}}}
Traffic Conditions: {{#if trafficConditions}}{{{trafficConditions}}}{{else}}Normal{{/if}}
Time of Travel: {{{timeOfTravel}}}

Provide the estimated ride duration in minutes and an explanation of how you arrived at the estimate. Adhere to the schema.`, 
});

const estimateRideDurationFlow = ai.defineFlow(
  {
    name: 'estimateRideDurationFlow',
    inputSchema: RouteDurationEstimationInputSchema,
    outputSchema: RouteDurationEstimationOutputSchema,
  },
  async input => {
    const {output} = await routeDurationPrompt(input);
    return output!;
  }
);
