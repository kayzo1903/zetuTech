// app/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Phone, Users, FileText, Settings } from 'lucide-react';
import { ContactInfo, SupportInfo, SiteSettings } from './types';
import ContactInfoTab from './contacts';
import SupportInfoTab from './support';
import FAQTab from './faqs';
import SiteSettingsTab from './site';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('contact');
  const [isLoading, setIsLoading] = useState(true);

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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Business Infos</h1>
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

          {/* Tab Contents */}
          <TabsContent value="contact">
            <ContactInfoTab 
              contactInfo={contactInfo}
              setContactInfo={setContactInfo}
            />
          </TabsContent>

          <TabsContent value="support">
            <SupportInfoTab 
              supportInfo={supportInfo}
              setSupportInfo={setSupportInfo}
            />
          </TabsContent>

          <TabsContent value="faq">
            <FAQTab 
              supportInfo={supportInfo}
              setSupportInfo={setSupportInfo}
            />
          </TabsContent>

          <TabsContent value="settings">
            <SiteSettingsTab 
              siteSettings={siteSettings}
              setSiteSettings={setSiteSettings}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}