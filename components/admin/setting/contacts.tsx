// app/admin/components/ContactInfoTab.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Phone, Mail, MapPin, Clock, MessageCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { ContactInfo } from './types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ContactInfoSchema } from './validation';

interface ContactInfoTabProps {
  contactInfo: ContactInfo;
  setContactInfo: (info: ContactInfo) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSave: (type: 'contact' | 'support' | 'site_settings', data: any) => Promise<boolean>;
}

export default function ContactInfoTab({ contactInfo, setContactInfo, onSave }: ContactInfoTabProps) {
  const [isSaving, setIsSaving] = useState(false);

  // Initialize react-hook-form with Zod validation
  const form = useForm<ContactInfo>({
    resolver: zodResolver(ContactInfoSchema),
    defaultValues: contactInfo,
    mode: 'onChange',
  });

  // Reset form when contactInfo prop changes
  useEffect(() => {
    form.reset(contactInfo);
  }, [contactInfo, form]);

  const handleSaveContactInfo = async (data: ContactInfo) => {
    setIsSaving(true);
    
    try {
      const success = await onSave('contact', data);
      
      if (success) {
        setContactInfo(data);
        form.reset(data); // Reset form state to mark as clean
        toast.success('Contact information updated successfully');
      } else {
        toast.error('Failed to update contact information');
      }
    } catch (error) {
      console.error('Error saving contact info:', error);
      toast.error('Failed to update contact information');
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
          <Phone className="w-5 h-5" />
          Contact Information
        </CardTitle>
        <CardDescription>
          Update your business contact details and location information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSaveContactInfo)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Address Field */}
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Business Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your business address"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Phone Field */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your phone number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email address"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Weekday Hours Field */}
                <FormField
                  control={form.control}
                  name="businessHours.weekdays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Weekday Hours
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Mon - Fri: 9:00 AM - 6:00 PM"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Weekend Hours Field */}
                <FormField
                  control={form.control}
                  name="businessHours.weekends"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weekend Hours</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Sat: 10:00 AM - 4:00 PM"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* WhatsApp Number Field */}
                <FormField
                  control={form.control}
                  name="whatsappNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        WhatsApp Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="255712345678 (without +)"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter without country code prefix
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Full Width Fields */}
            <div className="space-y-4">
              {/* WhatsApp Message Field */}
              <FormField
                control={form.control}
                name="whatsappMessage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp Default Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Default message for WhatsApp chats"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This message will be pre-filled when customers contact you via WhatsApp
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Map URL Field */}
              <FormField
                control={form.control}
                name="mapEmbedUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Google Maps Embed URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Paste your Google Maps embed URL"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Get the embed URL from Google Maps share options
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                      Save Contact Info
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