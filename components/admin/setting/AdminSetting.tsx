"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Phone, Users, FileText, Settings } from "lucide-react";
import { ContactInfo, SupportInfo, SiteSettings } from "./types";
import ContactInfoTab from "./contacts";
import SupportInfoTab from "./support";
import FAQTab from "./faqs";
import SiteSettingsTab from "./site";
import { toast } from "sonner"; 


export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("contact");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    address: "",
    phone: "",
    email: "",
    businessHours: {
      weekdays: "",
      weekends: "",
    },
    whatsappNumber: "",
    whatsappMessage: "",
    mapEmbedUrl: "",
  });

  const [supportInfo, setSupportInfo] = useState<SupportInfo>({
    supportEmail: "",
    supportPhone: "",
    liveChatHours: "",
    warrantyPeriod: "",
    shippingInfo: "",
    returnPolicy: "",
    faq: [],
  });

  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    siteName: "",
    siteDescription: "",
    currency: "TZS",
    maintenanceMode: false,
  });

  // Load data from API on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch("/api/admin/businessInfo");
        const result = await response.json();

        if (result.success) {
          setContactInfo(result.data.contactInfo);
          setSupportInfo(result.data.supportInfo);
          setSiteSettings(result.data.siteSettings);
        } else {
          console.error("Failed to load data:", result.error);
          toast.error("Failed to load settings");
        }
      } catch (error) {
        console.error("Error loading admin data:", error);
        toast.error("Error loading settings");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Enhanced save function with loading states and toast notifications
  const saveData = async (
    type: "contact" | "support" | "site_settings",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any
  ): Promise<boolean> => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/admin/businessInfo/${type}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      toast.success("Settings saved successfully!");
      return true;
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Failed to save settings");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading admin panel...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Business Information
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your site&apos;s static content and settings
          </p>
          {isSaving && (
            <div className="flex items-center gap-2 mt-2 text-sm text-blue-600">
              <div className="w-4 h-4 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              Saving changes...
            </div>
          )}
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          {/* Navigation Tabs */}
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <TabsTrigger
              value="contact"
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700"
              disabled={isSaving}
            >
              <Phone className="w-4 h-4" />
              <span>Contact Info</span>
            </TabsTrigger>
            <TabsTrigger
              value="support"
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700"
              disabled={isSaving}
            >
              <Users className="w-4 h-4" />
              <span>Support</span>
            </TabsTrigger>
            <TabsTrigger
              value="faq"
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700"
              disabled={isSaving}
            >
              <FileText className="w-4 h-4" />
              <span>FAQ</span>
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700"
              disabled={isSaving}
            >
              <Settings className="w-4 h-4" />
              <span>Site Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab Contents */}
          <TabsContent value="contact">
            <ContactInfoTab
              contactInfo={contactInfo}
              setContactInfo={setContactInfo}
              onSave={saveData}
              isSaving={isSaving}
            />
          </TabsContent>

          <TabsContent value="support">
            <SupportInfoTab
              supportInfo={supportInfo}
              setSupportInfo={setSupportInfo}
              onSave={saveData}
            />
          </TabsContent>

          <TabsContent value="faq">
            <FAQTab
              supportInfo={supportInfo}
              setSupportInfo={setSupportInfo}
              onSave={saveData}
              isSaving={isSaving}
            />
          </TabsContent>

          <TabsContent value="settings">
            <SiteSettingsTab
              siteSettings={siteSettings}
              setSiteSettings={setSiteSettings}
              onSave={saveData}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
