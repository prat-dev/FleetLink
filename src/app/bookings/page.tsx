import {Header} from '@/components/common/Header';
import {BookingsList} from '@/components/bookings/BookingsList';
import {getBookings} from '@/lib/actions';

export const dynamic = 'force-dynamic';

export default async function BookingsPage() {
  const bookings = await getBookings();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <h1 className="text-3xl font-bold">My Bookings</h1>
          <BookingsList initialBookings={bookings} />
        </div>
      </main>
    </div>
  );
}
