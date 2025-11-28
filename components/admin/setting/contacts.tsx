import { useState } from 'react';
import { ContactInfo } from './types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ContactInfoTabProps {
  contactInfo: ContactInfo;
  setContactInfo: (info: ContactInfo) => void;
  onSave: (type: 'contact', data: ContactInfo) => Promise<boolean>;
  isSaving: boolean;
}

export default function ContactInfoTab({ 
  contactInfo, 
  setContactInfo, 
  onSave,
  isSaving 
}: ContactInfoTabProps) {
  const [isDirty, setIsDirty] = useState(false);

  const handleSave = async () => {
    const success = await onSave('contact', contactInfo);
    if (success) {
      setIsDirty(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (field: keyof ContactInfo, value: any) => {
    setContactInfo({
      ...contactInfo,
      [field]: value
    });
    setIsDirty(true);
  };

  const handleBusinessHoursChange = (field: keyof typeof contactInfo.businessHours, value: string) => {
    setContactInfo({
      ...contactInfo,
      businessHours: {
        ...contactInfo.businessHours,
        [field]: value
      }
    });
    setIsDirty(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>
            Update your business contact details and location information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="address">Business Address</Label>
              <Input
                id="address"
                value={contactInfo.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="Enter your business address"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={contactInfo.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+255 XXX XXX XXX"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={contactInfo.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="contact@business.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
              <Input
                id="whatsappNumber"
                value={contactInfo.whatsappNumber}
                onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                placeholder="255712345678"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsappMessage">WhatsApp Default Message</Label>
            <Input
              id="whatsappMessage"
              value={contactInfo.whatsappMessage}
              onChange={(e) => handleChange('whatsappMessage', e.target.value)}
              placeholder="Default message for WhatsApp chats"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weekdays">Weekday Hours</Label>
              <Input
                id="weekdays"
                value={contactInfo.businessHours.weekdays}
                onChange={(e) => handleBusinessHoursChange('weekdays', e.target.value)}
                placeholder="Mon - Fri: 9:00 AM - 6:00 PM"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weekends">Weekend Hours</Label>
              <Input
                id="weekends"
                value={contactInfo.businessHours.weekends}
                onChange={(e) => handleBusinessHoursChange('weekends', e.target.value)}
                placeholder="Sat: 10:00 AM - 4:00 PM"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mapEmbedUrl">Google Maps Embed URL</Label>
            <Input
              id="mapEmbedUrl"
              value={contactInfo.mapEmbedUrl}
              onChange={(e) => handleChange('mapEmbedUrl', e.target.value)}
              placeholder="https://maps.google.com/embed?..."
            />
          </div>

          <Button 
            onClick={handleSave} 
            disabled={!isDirty || isSaving}
            className="w-full md:w-auto"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}