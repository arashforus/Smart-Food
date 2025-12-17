import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { mockRestaurant } from '@/lib/mockData';
import type { Restaurant } from '@/lib/types';

const restaurantSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  address: z.string().min(1, 'Address is required'),
  phone: z.string().min(1, 'Phone is required'),
  email: z.string().email('Valid email is required'),
  hours: z.string().min(1, 'Hours are required'),
  currency: z.string().min(1, 'Currency is required'),
  currencySymbol: z.string().min(1, 'Currency symbol is required'),
});

type RestaurantFormData = z.infer<typeof restaurantSchema>;

export default function RestaurantPage() {
  const { toast } = useToast();
  const [restaurant, setRestaurant] = useState<Restaurant>(mockRestaurant);
  const [isPending, setIsPending] = useState(false);

  const form = useForm<RestaurantFormData>({
    resolver: zodResolver(restaurantSchema),
    defaultValues: {
      name: restaurant.name,
      description: restaurant.description,
      address: restaurant.address,
      phone: restaurant.phone,
      email: restaurant.email,
      hours: restaurant.hours,
      currency: restaurant.currency,
      currencySymbol: restaurant.currencySymbol,
    },
  });

  const handleSubmit = (data: RestaurantFormData) => {
    setIsPending(true);
    setTimeout(() => {
      setRestaurant({ ...restaurant, ...data });
      setIsPending(false);
      toast({
        title: 'Restaurant Updated',
        description: 'Your restaurant information has been saved.',
      });
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Restaurant Info</h1>
        <p className="text-muted-foreground">Manage your restaurant details</p>
      </div>

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Restaurant Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Restaurant Name</FormLabel>
                    <FormControl><Input {...field} data-testid="input-restaurant-name" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl><Textarea {...field} rows={3} data-testid="input-restaurant-description" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl><Input {...field} data-testid="input-restaurant-phone" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl><Input type="email" {...field} data-testid="input-restaurant-email" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="address" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl><Input {...field} data-testid="input-restaurant-address" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="hours" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Hours</FormLabel>
                    <FormControl><Input {...field} data-testid="input-restaurant-hours" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="currency" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <FormControl><Input {...field} placeholder="USD" data-testid="input-restaurant-currency" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="currencySymbol" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency Symbol</FormLabel>
                      <FormControl><Input {...field} placeholder="$" data-testid="input-restaurant-currency-symbol" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" disabled={isPending} data-testid="button-save-restaurant">
                    {isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
