// app/admin/components/FAQTab.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, FileText, Plus, Trash2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { SupportInfo, SetSupportInfo } from './types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { SupportInfoSchema } from './validation';

interface FAQTabProps {
  supportInfo: SupportInfo;
  setSupportInfo: SetSupportInfo;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSave: (type: 'contact' | 'support' | 'site_settings', data: any) => Promise<boolean>;
}

export default function FAQTab({ supportInfo, setSupportInfo, onSave }: FAQTabProps) {
  const [isSaving, setIsSaving] = useState(false);

  // Initialize react-hook-form with Zod validation
  const form = useForm<SupportInfo>({
    resolver: zodResolver(SupportInfoSchema),
    defaultValues: supportInfo,
    mode: 'onChange',
  });

  // Use field array for dynamic FAQ items
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'faq',
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
        toast.success('FAQ updated successfully');
      } else {
        toast.error('Failed to update FAQ');
      }
    } catch (error) {
      console.error('Error saving FAQ:', error);
      toast.error('Failed to update FAQ');
    } finally {
      setIsSaving(false);
    }
  };

  const addFAQ = () => {
    const newFAQ = {
      id: Date.now().toString(),
      question: '',
      answer: ''
    };
    append(newFAQ);
  };

  const removeFAQ = (index: number) => {
    remove(index);
  };

  // Check if form has errors
  const hasErrors = Object.keys(form.formState.errors).length > 0;
  const hasFAQErrors = form.formState.errors.faq !== undefined;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          FAQ Management
        </CardTitle>
        <CardDescription>
          Add, edit, or remove frequently asked questions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSaveSupportInfo)} className="space-y-6">
            {/* Support Information Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <FormField
                control={form.control}
                name="supportEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Support Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="support@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* FAQ Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Frequently Asked Questions</h3>
                <Button
                  type="button"
                  onClick={addFAQ}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add New FAQ
                </Button>
              </div>

              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-3">
                    <div className="flex justify-between items-start">
                      <FormLabel>FAQ #{index + 1}</FormLabel>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFAQ(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Question Field */}
                    <FormField
                      control={form.control}
                      name={`faq.${index}.question`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Question</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter question"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Answer Field */}
                    <FormField
                      control={form.control}
                      name={`faq.${index}.answer`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Answer</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter answer"
                              rows={3}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}

                {fields.length === 0 && (
                  <div className="text-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No FAQ items yet. Add your first FAQ!</p>
                  </div>
                )}
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
                      Save FAQ Changes
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

              {hasFAQErrors && (
                <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                  <AlertCircle className="w-4 h-4" />
                  Please fix FAQ validation errors before saving
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