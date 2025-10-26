// app/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Save, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Users, 
  Settings,
  FileText,
  Plus,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';

// Types for our static content
interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  businessHours: {
    weekdays: string;
    weekends: string;
  };
  whatsappNumber: string;
  whatsappMessage: string;
  mapEmbedUrl: string;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface SupportInfo {
  supportEmail: string;
  supportPhone: string;
  liveChatHours: string;
  warrantyPeriod: string;
  shippingInfo: string;
  returnPolicy: string;
  faq: FAQItem[];
}

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  currency: string;
  maintenanceMode: boolean;
}

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('contact');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // State for all editable content
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    address: 'Kariakoo, Dar es Salaam, Tanzania',
    phone: '+255 712 345 678',
    email: 'support@muuzatech.com',
    businessHours: {
      weekdays: 'Mon - Fri: 9:00 AM - 6:00 PM',
      weekends: 'Sat: 10:00 AM - 4:00 PM'
    },
    whatsappNumber: '255712345678',
    whatsappMessage: "Hello! I'm interested in your products and would like to get more information.",
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15840.035102001923!2d39.2783565!3d-6.8120136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x185c4b5bfa78d6c5%3A0xf94b1d4e2f2a0e7c!2sKariakoo!5e0!3m2!1sen!2stz!4v1632724083452!5m2!1sen!2stz'
  });

  const [supportInfo, setSupportInfo] = useState<SupportInfo>({
    supportEmail: 'support@zetutech.co.tz',
    supportPhone: '+255 XXX XXX XXX',
    liveChatHours: 'Available 9 AM - 9 PM (GMT+3)',
    warrantyPeriod: '1-Year Warranty',
    shippingInfo: 'Free shipping on orders over TZS 500,000',
    returnPolicy: '30-day return policy for unused items',
    faq: [
      {
        id: '1',
        question: 'How do I reset my password?',
        answer: 'To reset your password, go to the login page and click on "Forgot Password." Follow the instructions sent to your registered email address.'
      },
      {
        id: '2',
        question: 'How do I track my order?',
        answer: 'You can track your order by navigating to the "My Orders" section in your account. Order tracking details will be provided there.'
      },
      {
        id: '3',
        question: 'Can I update my delivery address after placing an order?',
        answer: 'Yes, you can update your delivery address before the order is shipped by contacting our support team immediately.'
      },
      {
        id: '4',
        question: 'What payment methods do you accept?',
        answer: 'We accept major payment methods, including mobile money, debit/credit cards, and direct bank transfers.'
      }
    ]
  });

  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    siteName: 'ZetuTech',
    siteDescription: 'Your trusted local laptop store in Tanzania',
    currency: 'TZS',
    maintenanceMode: false
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    const loadData = () => {
      try {
        const savedContactInfo = localStorage.getItem('admin-contact-info');
        const savedSupportInfo = localStorage.getItem('admin-support-info');
        const savedSiteSettings = localStorage.getItem('admin-site-settings');

        if (savedContactInfo) setContactInfo(JSON.parse(savedContactInfo));
        if (savedSupportInfo) setSupportInfo(JSON.parse(savedSupportInfo));
        if (savedSiteSettings) setSiteSettings(JSON.parse(savedSiteSettings));
      } catch (error) {
        console.error('Error loading admin data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Save data to localStorage
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

  const addFAQ = () => {
    const newFAQ: FAQItem = {
      id: Date.now().toString(),
      question: '',
      answer: ''
    };
    setSupportInfo(prev => ({
      ...prev,
      faq: [...prev.faq, newFAQ]
    }));
  };

  const updateFAQ = (id: string, field: 'question' | 'answer', value: string) => {
    setSupportInfo(prev => ({
      ...prev,
      faq: prev.faq.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeFAQ = (id: string) => {
    setSupportInfo(prev => ({
      ...prev,
      faq: prev.faq.filter(item => item.id !== id)
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Bussiness Infos</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your site&apos;s static content and settings
            </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Navigation Tabs */}
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <TabsTrigger value="contact" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Phone className="w-4 h-4" />
              <span>Contact Info</span>
            </TabsTrigger>
            <TabsTrigger value="support" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Users className="w-4 h-4" />
              <span>Support</span>
            </TabsTrigger>
            <TabsTrigger value="faq" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <FileText className="w-4 h-4" />
              <span>FAQ</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Settings className="w-4 h-4" />
              <span>Site Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Contact Information Tab */}
          <TabsContent value="contact" className="space-y-6">
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
          </TabsContent>

          {/* Support Information Tab */}
          <TabsContent value="support" className="space-y-6">
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
          </TabsContent>

          {/* FAQ Management Tab */}
          <TabsContent value="faq" className="space-y-6">
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
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {supportInfo.faq.map((faq) => (
                    <div key={faq.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-3">
                      <div className="flex justify-between items-start">
                        <Label htmlFor={`question-${faq.id}`}>Question</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFAQ(faq.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <Input
                        id={`question-${faq.id}`}
                        value={faq.question}
                        onChange={(e) => updateFAQ(faq.id, 'question', e.target.value)}
                        placeholder="Enter question"
                      />
                      <div>
                        <Label htmlFor={`answer-${faq.id}`}>Answer</Label>
                        <Textarea
                          id={`answer-${faq.id}`}
                          value={faq.answer}
                          onChange={(e) => updateFAQ(faq.id, 'answer', e.target.value)}
                          placeholder="Enter answer"
                          rows={3}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-4">
                  <Button
                    onClick={addFAQ}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add New FAQ
                  </Button>

                  <Button 
                    onClick={handleSaveSupportInfo} 
                    disabled={isSaving}
                    className="flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? 'Saving...' : 'Save FAQ Changes'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Site Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}