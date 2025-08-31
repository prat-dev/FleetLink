'use client';

import * as React from 'react';
import Image from 'next/image';
import {useRouter} from 'next/navigation';
import {deleteBooking} from '@/lib/actions';
import type {Booking} from '@/lib/types';
import {useToast} from '@/hooks/use-toast';
import {Card, CardContent, CardHeader, CardTitle, CardFooter} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {Trash2, Calendar, Clock, Users, MapPin} from 'lucide-react';

type BookingsListProps = {
  initialBookings: Booking[];
};

export function BookingsList({initialBookings}: BookingsListProps) {
  const [bookings, setBookings] = React.useState(initialBookings);
  const [isDeleting, setIsDeleting] = React.useState<string | null>(null);
  const {toast} = useToast();
  const router = useRouter();

  const handleCancelBooking = async (bookingId: string) => {
    setIsDeleting(bookingId);
    try {
      await deleteBooking(bookingId);
      setBookings(bookings.filter(b => b.id !== bookingId));
      toast({
        title: 'Booking Cancelled',
        description: 'Your booking has been successfully cancelled.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Cancellation Failed',
        description: 'Could not cancel the booking. Please try again.',
      });
    } finally {
      setIsDeleting(null);
    }
  };

  if (bookings.length === 0) {
    return (
      <div className="text-center py-16 border-2 border-dashed rounded-lg">
        <h2 className="text-xl font-semibold">No bookings yet.</h2>
        <p className="text-muted-foreground mt-2">
          Your active and past bookings will appear here.
        </p>
        <Button onClick={() => router.push('/')} className="mt-4">
          Book a Ride
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {bookings.map(booking => (
        <Card key={booking.id} className="flex flex-col">
          <CardHeader>
            <CardTitle>{booking.vehicle.type}</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow space-y-4">
            <Image
              src={booking.vehicle.imageUrl}
              alt={booking.vehicle.type}
              width={400}
              height={250}
              className="rounded-lg object-cover w-full aspect-video"
            />
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>
                  Booked on: {new Date(booking.bookingTime).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>Ride at: {booking.startTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span>Capacity: {booking.vehicle.capacity}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>
                  Route: {booking.origin} to {booking.destination}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  <Trash2 className="mr-2 h-4 w-4" />
                  {isDeleting === booking.id ? 'Cancelling...' : 'Cancel Booking'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently cancel your booking.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Back</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleCancelBooking(booking.id)}>
                    Yes, Cancel
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
