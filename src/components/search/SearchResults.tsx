import Image from 'next/image';
import Link from 'next/link';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import type {SearchResult} from '@/lib/types';
import {Users, Star, Info, Bot, Clock} from 'lucide-react';
import {createBooking} from '@/lib/actions';
import {useToast} from '@/hooks/use-toast';
import {useRouter} from 'next/navigation';
import * as React from 'react';

type SearchResultsProps = {
  state: {
    results?: (Partial<SearchResult> & {estimation: SearchResult['estimation']; startTime?: string})[];
    error?: string;
    message?: string;
  };
};

export function SearchResults({state}: SearchResultsProps) {
  const {results, error, message} = state;
  const {toast} = useToast();
  const router = useRouter();
  const [isBooking, setIsBooking] = React.useState<number | null>(null);

  const handleBookNow = async (vehicleId: number, startTime: string) => {
    setIsBooking(vehicleId);
    try {
      await createBooking(vehicleId, startTime);
      toast({
        title: 'Booking Successful!',
        description: 'Your ride has been booked.',
      });
      router.push('/booking/confirmed');
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Booking Failed',
        description: 'Could not book the ride. Please try again.',
      });
    } finally {
      setIsBooking(null);
    }
  };

  if (error) {
    return null; // Error is handled by toast in the parent component
  }

  if (!results || results.length === 0) {
    return (
      <div className="text-center text-muted-foreground mt-8">
        <p className="text-lg">Your journey awaits. Start by searching for a ride above.</p>
      </div>
    );
  }

  const hasOnlyEstimation = results.length === 1 && !results[0].id;

  if (hasOnlyEstimation) {
    const {estimation} = results[0];
    return (
      <Card className="max-w-2xl mx-auto mt-8 shadow-md animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Bot className="w-6 h-6 text-primary" />
            <span>AI Route Estimation</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-muted-foreground" />
            <p className="text-lg">
              Estimated duration:{' '}
              <span className="font-bold text-primary">
                {estimation.estimatedDurationMinutes} minutes
              </span>
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-muted-foreground mt-1 shrink-0" />
            <div>
              <h4 className="font-semibold">Explanation</h4>
              <p className="text-muted-foreground">{estimation.explanation}</p>
            </div>
          </div>
        </CardContent>
        {message && (
          <CardFooter>
            <p className="text-sm text-muted-foreground">{message}</p>
          </CardFooter>
        )}
      </Card>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <h2 className="text-3xl font-bold text-center">Available Vehicles</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {(results as SearchResult[]).map(vehicle => (
          <Card
            key={vehicle.id}
            className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="relative">
              <Image
                src={vehicle.imageUrl}
                alt={vehicle.type}
                width={600}
                height={400}
                className="object-cover w-full h-48"
                data-ai-hint={`${vehicle.type.toLowerCase()} car`}
              />
              <Badge variant="secondary" className="absolute top-2 right-2">
                {vehicle.type}
              </Badge>
            </div>
            <CardHeader>
              <CardTitle>Route Estimate</CardTitle>
              <div className="text-sm text-muted-foreground flex items-center gap-2 pt-2">
                <Clock className="w-4 h-4" />
                <span>{vehicle.estimation.estimatedDurationMinutes} minutes</span>
              </div>
            </CardHeader>
            <CardContent className="flex-grow space-y-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <span>Capacity: {vehicle.capacity} people</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span>
                  Driver: {vehicle.driver.name} ({vehicle.driver.rating})
                </span>
              </div>
              <div className="text-sm text-muted-foreground pt-2">
                <p className="font-semibold flex items-center gap-2">
                  <Info className="w-4 h-4" /> AI Note:
                </p>
                <p>{vehicle.estimation.explanation}</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => handleBookNow(vehicle.id, vehicle.startTime!)}
                disabled={isBooking === vehicle.id}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold"
              >
                {isBooking === vehicle.id ? 'Booking...' : 'Book Now'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
