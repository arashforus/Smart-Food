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
  FormDescription,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { mockRestaurant } from '@/lib/mockData';
import type { Restaurant } from '@/lib/types';
import ImageUpload from '@/components/admin/ImageUpload';
import { MapPin } from 'lucide-react';

const restaurantSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  address: z.string().min(1, 'Address is required'),
  phone: z.string().min(1, 'Phone is required'),
  email: z.string().email('Valid email is required'),
  hours: z.string().min(1, 'Hours are required'),
  currency: z.string().min(1, 'Currency is required'),
  currencySymbol: z.string().min(1, 'Currency symbol is required'),
  logo: z.string().optional(),
  backgroundImage: z.string().optional(),
  mapLat: z.number().optional(),
  mapLng: z.number().optional(),
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
      logo: restaurant.logo || '',
      backgroundImage: restaurant.backgroundImage || '',
      mapLat: restaurant.mapLat,
      mapLng: restaurant.mapLng,
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

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
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

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Logo & Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField control={form.control} name="logo" render={({ field }) => (
                <FormItem>
                  <FormLabel>Restaurant Logo</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Upload logo or enter URL"
                      testId="input-restaurant-logo"
                    />
                  </FormControl>
                  <FormDescription>Your restaurant logo will appear on the menu</FormDescription>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="backgroundImage" render={({ field }) => (
                <FormItem>
                  <FormLabel>Background Image</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Upload background or enter URL"
                      testId="input-restaurant-background"
                    />
                  </FormControl>
                  <FormDescription>Background image for the QR menu landing page</FormDescription>
                  <FormMessage />
                </FormItem>
              )} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Google Maps Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="mapLat" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                        placeholder="40.7128"
                        data-testid="input-restaurant-lat"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="mapLng" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                        placeholder="-74.0060"
                        data-testid="input-restaurant-lng"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <FormDescription>
                Enter coordinates for Google Maps integration. 
                <a 
                  href="https://www.google.com/maps" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary ml-1 underline"
                >
                  Find coordinates on Google Maps
                </a>
              </FormDescription>
              {form.watch('mapLat') && form.watch('mapLng') && (
                <div className="rounded-md overflow-hidden h-40 bg-muted flex items-center justify-center border">
                  <a
                    href={`https://www.google.com/maps?q=${form.watch('mapLat')},${form.watch('mapLng')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline text-sm"
                    data-testid="link-view-map"
                  >
                    View on Google Maps
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
