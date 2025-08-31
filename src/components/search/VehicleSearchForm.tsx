'use client';

import * as React from 'react';
import {useActionState} from 'react';
import {useFormStatus} from 'react-dom';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {Clock, MapPin, Users} from 'lucide-react';

import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {getRideEstimateAndVehicles} from '@/lib/actions';

const searchFormSchema = z.object({
  origin: z.string().min(3, {message: 'Origin pincode must be at least 3 characters.'}),
  destination: z.string().min(3, {message: 'Destination pincode must be at least 3 characters.'}),
  capacity: z.coerce.number().min(1, {message: 'Capacity must be at least 1.'}),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Please enter a valid HH:MM time.',
  }),
});

type SearchFormProps = {
  onSearch: (state: any) => void;
};

function SubmitButton() {
  const {pending} = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-base py-6"
    >
      {pending ? 'Searching...' : 'Find a Ride'}
    </Button>
  );
}

export function VehicleSearchForm({onSearch}: SearchFormProps) {
  const [state, formAction] = useActionState(getRideEstimateAndVehicles, {
    results: [],
  });

  const form = useForm<z.infer<typeof searchFormSchema>>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      origin: '',
      destination: '',
      capacity: 1,
      startTime: '10:00',
    },
  });

  React.useEffect(() => {
    onSearch(state);
  }, [state, onSearch]);

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl border-2 border-primary/10">
      <CardHeader>
        <CardTitle className="text-center text-3xl font-bold text-primary">Find Your Perfect Ride</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            action={formAction}
            className="space-y-6"
            // Use form.handleSubmit to trigger client-side validation before submitting
            onSubmit={form.handleSubmit(() => {
              // Create a FormData object from the valid form data
              const formData = new FormData();
              const data = form.getValues();
              Object.entries(data).forEach(([key, value]) => {
                formData.append(key, String(value));
              });
              // Manually call the server action
              formAction(formData);
            })}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="origin"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Origin Pincode</FormLabel>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <FormControl>
                        <Input placeholder="e.g. 110001" {...field} className="pl-10" />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="destination"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Destination Pincode</FormLabel>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <FormControl>
                        <Input placeholder="e.g. 400050" {...field} className="pl-10" />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="capacity"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Capacity</FormLabel>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          placeholder="e.g. 4"
                          {...field}
                          className="pl-10"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="startTime"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <FormControl>
                        <Input type="time" {...field} className="pl-10" />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <SubmitButton />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
