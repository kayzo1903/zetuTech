// app/admin/components/SupportInfoTab.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Save, Users } from 'lucide-react';
import { toast } from 'sonner';
import { SupportInfo } from './types';


interface SupportInfoTabProps {
  supportInfo: SupportInfo;
  setSupportInfo: (info: SupportInfo) => void;
}

export default function SupportInfoTab({ supportInfo, setSupportInfo }: SupportInfoTabProps) {
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

  const handleSaveSupportInfo = async () => {
    setIsSaving(true);
    const success = await saveData('admin-support-info', supportInfo);
    setIsSaving(false);
    
    if (success) {
      toast.success('Support information updated successfully');
    } else {
      toast.error('Failed to update support information');
    }
  };

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
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="supportEmail">Support Email</Label>
              <Input
                id="supportEmail"
                type="email"
                value={supportInfo.supportEmail}
                onChange={(e) => setSupportInfo({ ...supportInfo, supportEmail: e.target.value })}
                placeholder="support@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supportPhone">Support Phone</Label>
              <Input
                id="supportPhone"
                value={supportInfo.supportPhone}
                onChange={(e) => setSupportInfo({ ...supportInfo, supportPhone: e.target.value })}
                placeholder="+255 XXX XXX XXX"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="liveChatHours">Live Chat Hours</Label>
              <Input
                id="liveChatHours"
                value={supportInfo.liveChatHours}
                onChange={(e) => setSupportInfo({ ...supportInfo, liveChatHours: e.target.value })}
                placeholder="Available 9 AM - 9 PM (GMT+3)"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="warranty">Warranty Period</Label>
              <Input
                id="warranty"
                value={supportInfo.warrantyPeriod}
                onChange={(e) => setSupportInfo({ ...supportInfo, warrantyPeriod: e.target.value })}
                placeholder="1-Year Warranty"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shipping">Shipping Information</Label>
              <Input
                id="shipping"
                value={supportInfo.shippingInfo}
                onChange={(e) => setSupportInfo({ ...supportInfo, shippingInfo: e.target.value })}
                placeholder="Free shipping on orders over..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="returns">Return Policy</Label>
              <Input
                id="returns"
                value={supportInfo.returnPolicy}
                onChange={(e) => setSupportInfo({ ...supportInfo, returnPolicy: e.target.value })}
                placeholder="30-day return policy..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button 
            onClick={handleSaveSupportInfo} 
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save Support Info'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}