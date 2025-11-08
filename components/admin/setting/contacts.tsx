// app/admin/components/ContactInfoTab.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Save, Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { ContactInfo } from './types';


interface ContactInfoTabProps {
  contactInfo: ContactInfo;
  setContactInfo: (info: ContactInfo) => void;
}

export default function ContactInfoTab({ contactInfo, setContactInfo }: ContactInfoTabProps) {
  const [isSaving, setIsSaving] = useState(false);

  const saveData = async (key: string, data: unknown) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error saving data:', error);
      return false;
    }
  };

  const handleSaveContactInfo = async () => {
    setIsSaving(true);
    const success = await saveData('admin-contact-info', contactInfo);
    setIsSaving(false);
    
    if (success) {
      toast.success('Contact information updated successfully');
    } else {
      toast.error('Failed to update contact information');
    }
  };

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
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Business Address
              </Label>
              <Input
                id="address"
                value={contactInfo.address}
                onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                placeholder="Enter your business address"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                value={contactInfo.phone}
                onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                placeholder="Enter your phone number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={contactInfo.email}
                onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                placeholder="Enter your email address"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="weekdays" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Weekday Hours
              </Label>
              <Input
                id="weekdays"
                value={contactInfo.businessHours.weekdays}
                onChange={(e) => setContactInfo({
                  ...contactInfo,
                  businessHours: { ...contactInfo.businessHours, weekdays: e.target.value }
                })}
                placeholder="e.g., Mon - Fri: 9:00 AM - 6:00 PM"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weekends">Weekend Hours</Label>
              <Input
                id="weekends"
                value={contactInfo.businessHours.weekends}
                onChange={(e) => setContactInfo({
                  ...contactInfo,
                  businessHours: { ...contactInfo.businessHours, weekends: e.target.value }
                })}
                placeholder="e.g., Sat: 10:00 AM - 4:00 PM"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp" className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                WhatsApp Number
              </Label>
              <Input
                id="whatsapp"
                value={contactInfo.whatsappNumber}
                onChange={(e) => setContactInfo({ ...contactInfo, whatsappNumber: e.target.value })}
                placeholder="255712345678 (without +)"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="whatsappMessage">WhatsApp Default Message</Label>
            <Textarea
              id="whatsappMessage"
              value={contactInfo.whatsappMessage}
              onChange={(e) => setContactInfo({ ...contactInfo, whatsappMessage: e.target.value })}
              placeholder="Default message for WhatsApp chats"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mapUrl">Google Maps Embed URL</Label>
            <Input
              id="mapUrl"
              value={contactInfo.mapEmbedUrl}
              onChange={(e) => setContactInfo({ ...contactInfo, mapEmbedUrl: e.target.value })}
              placeholder="Paste your Google Maps embed URL"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button 
            onClick={handleSaveContactInfo} 
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save Contact Info'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}