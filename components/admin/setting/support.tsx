// app/admin/components/SupportInfoTab.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Users, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { SupportInfo } from './types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { SupportInfoSchema } from './validation';

interface SupportInfoTabProps {
  supportInfo: SupportInfo;
  setSupportInfo: (info: SupportInfo) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSave: (type: 'contact' | 'support' | 'site_settings', data: any) => Promise<boolean>;
}

export default function SupportInfoTab({ supportInfo, setSupportInfo, onSave }: SupportInfoTabProps) {
  const [isSaving, setIsSaving] = useState(false);

  // Initialize react-hook-form with Zod validation
  const form = useForm<SupportInfo>({
    resolver: zodResolver(SupportInfoSchema),
    defaultValues: supportInfo,
    mode: 'onChange',
  });

  // Reset form when supportInfo prop changes
  useEffect(() => {
    form.reset(supportInfo);
  }, [supportInfo, form]);

  const handleSaveSupportInfo = async (data: SupportInfo) => {
    setIsSaving(true);
    
    try {
      const success = await onSave('support', data);
      
      if (success) {
        setSupportInfo(data);
        form.reset(data); // Reset form state to mark as clean
        toast.success('Support information updated successfully');
      } else {
        toast.error('Failed to update support information');
      }
    } catch (error) {
      console.error('Error saving support info:', error);
      toast.error('Failed to update support information');
    } finally {
      setIsSaving(false);
    }
  };

  // Check if form has errors
  const hasErrors = Object.keys(form.formState.errors).length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Support Information
        </CardTitle>
        <CardDescription>
          Manage your support contact details and policies
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSaveSupportInfo)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Support Email Field */}
                <FormField
                  control={form.control}
                  name="supportEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Support Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="support@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Email address for customer support inquiries
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Support Phone Field */}
                <FormField
                  control={form.control}
                  name="supportPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Support Phone</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="+255 XXX XXX XXX"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Phone number for customer support
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Live Chat Hours Field */}
                <FormField
                  control={form.control}
                  name="liveChatHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Live Chat Hours</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Available 9 AM - 9 PM (GMT+3)"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Hours when live chat support is available
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Warranty Period Field */}
                <FormField
                  control={form.control}
                  name="warrantyPeriod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Warranty Period</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="1-Year Warranty"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Standard warranty period for products
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Shipping Information Field */}
                <FormField
                  control={form.control}
                  name="shippingInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shipping Information</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Free shipping on orders over..."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Shipping policies and free shipping threshold
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Return Policy Field */}
                <FormField
                  control={form.control}
                  name="returnPolicy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Return Policy</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="30-day return policy..."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Return and refund policy details
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Save Button and Status */}
            <div className="flex flex-col gap-4 pt-4">
              {/* Save Button */}
              <div className="flex justify-end">
                <Button 
                  type="submit"
                  disabled={isSaving || hasErrors || !form.formState.isDirty}
                  className="flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Support Info
                    </>
                  )}
                </Button>
              </div>

              {/* Form Status Messages */}
              {hasErrors && (
                <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                  <AlertCircle className="w-4 h-4" />
                  Please fix all validation errors before saving
                </div>
              )}

              {form.formState.isDirty && !hasErrors && (
                <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
                  <AlertCircle className="w-4 h-4" />
                  You have unsaved changes
                </div>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}