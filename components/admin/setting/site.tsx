// app/admin/components/SiteSettingsTab.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Save, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { SiteSettings } from './types';

interface SiteSettingsTabProps {
  siteSettings: SiteSettings;
  setSiteSettings: (settings: SiteSettings) => void;
}

export default function SiteSettingsTab({ siteSettings, setSiteSettings }: SiteSettingsTabProps) {
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

  const handleSaveSiteSettings = async () => {
    setIsSaving(true);
    const success = await saveData('admin-site-settings', siteSettings);
    setIsSaving(false);
    
    if (success) {
      toast.success('Site settings updated successfully');
    } else {
      toast.error('Failed to update site settings');
    }
  };

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
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                value={siteSettings.siteName}
                onChange={(e) => setSiteSettings({ ...siteSettings, siteName: e.target.value })}
                placeholder="Your site name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="siteDescription">Site Description</Label>
              <Textarea
                id="siteDescription"
                value={siteSettings.siteDescription}
                onChange={(e) => setSiteSettings({ ...siteSettings, siteDescription: e.target.value })}
                placeholder="Brief description of your site"
                rows={3}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Input
                id="currency"
                value={siteSettings.currency}
                onChange={(e) => setSiteSettings({ ...siteSettings, currency: e.target.value })}
                placeholder="TZS"
              />
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="space-y-0.5">
                <Label htmlFor="maintenance">Maintenance Mode</Label>
                <p className="text-sm text-gray-500">Temporarily disable the site</p>
              </div>
              <Switch
                id="maintenance"
                checked={siteSettings.maintenanceMode}
                onCheckedChange={(checked) => setSiteSettings({ ...siteSettings, maintenanceMode: checked })}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button 
            onClick={handleSaveSiteSettings} 
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save Site Settings'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}