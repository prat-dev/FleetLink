import {Truck, CalendarDays} from 'lucide-react';
import Link from 'next/link';
import {Button} from '@/components/ui/button';

export function Header() {
  return (
    <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-40">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Truck className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-foreground">FleetLink</span>
        </Link>
        <nav>
          <Button variant="ghost" asChild>
            <Link href="/bookings">
              <CalendarDays className="mr-2 h-4 w-4" />
              My Bookings
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
