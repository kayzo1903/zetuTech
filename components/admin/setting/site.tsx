// app/admin/components/SiteSettingsTab.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Save, Settings, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { SiteSettings } from './types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { SiteSettingsSchema } from './validation';

interface SiteSettingsTabProps {
  siteSettings: SiteSettings;
  setSiteSettings: (settings: SiteSettings) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSave: (type: 'contact' | 'support' | 'site_settings', data: any) => Promise<boolean>;
}

export default function SiteSettingsTab({ siteSettings, setSiteSettings, onSave }: SiteSettingsTabProps) {
  const [isSaving, setIsSaving] = useState(false);

  // Initialize react-hook-form with Zod validation
  const form = useForm<SiteSettings>({
    resolver: zodResolver(SiteSettingsSchema),
    defaultValues: siteSettings,
    mode: 'onChange',
  });

  // Reset form when siteSettings prop changes
  useEffect(() => {
    form.reset(siteSettings);
  }, [siteSettings, form]);

  const handleSaveSiteSettings = async (data: SiteSettings) => {
    setIsSaving(true);
    
    try {
      const success = await onSave('site_settings', data);
      
      if (success) {
        setSiteSettings(data);
        form.reset(data); // Reset form state to mark as clean
        toast.success('Site settings updated successfully');
      } else {
        toast.error('Failed to update site settings');
      }
    } catch (error) {
      console.error('Error saving site settings:', error);
      toast.error('Failed to update site settings');
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
          <Settings className="w-5 h-5" />
          Site Settings
        </CardTitle>
        <CardDescription>
          Configure general site settings and preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSaveSiteSettings)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Site Name Field */}
                <FormField
                  control={form.control}
                  name="siteName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your site name"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        The name of your website that appears in the browser tab
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Site Description Field */}
                <FormField
                  control={form.control}
                  name="siteDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief description of your site"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        A short description that appears in search engines and social media
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Currency Field */}
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="TZS"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        The currency code used for pricing (e.g., TZS, USD, EUR)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Maintenance Mode Field */}
                <FormField
                  control={form.control}
                  name="maintenanceMode"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Maintenance Mode</FormLabel>
                          <FormDescription>
                            Temporarily disable the site for maintenance
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </div>
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
                      Save Site Settings
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