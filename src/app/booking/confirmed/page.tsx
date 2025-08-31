import Link from 'next/link';
import {CheckCircle2} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Header} from '@/components/common/Header';

export default function BookingConfirmedPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center container mx-auto px-4">
        <Card className="w-full max-w-md mx-auto shadow-lg animate-fade-in-up">
          <CardHeader className="text-center">
            <div className="mx-auto bg-green-100 dark:bg-green-900/50 rounded-full h-16 w-16 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="mt-4 text-2xl font-bold">Booking Confirmed!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Your vehicle has been successfully booked. You will receive a confirmation email
              shortly with the details.
            </p>
            <Button asChild className="font-bold">
              <Link href="/">Back to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
