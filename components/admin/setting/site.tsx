"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Save,
  Settings,
  AlertCircle,
  Wrench,
  XCircle,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { SiteSettings } from "./types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SiteSettingsSchema } from "./validation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

interface SiteSettingsTabProps {
  siteSettings: SiteSettings;
  setSiteSettings: (settings: SiteSettings) => void;
  onSave: (
    type: "contact" | "support" | "site_settings",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any
  ) => Promise<boolean>;
}

export default function SiteSettingsTab({
  siteSettings,
  setSiteSettings,
  onSave,
}: SiteSettingsTabProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [note, setNote] = useState("");
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [pendingMaintenanceMode, setPendingMaintenanceMode] = useState<
    boolean | null
  >(null);

  const form = useForm<SiteSettings>({
    resolver: zodResolver(SiteSettingsSchema),
    defaultValues: siteSettings,
    mode: "onChange",
  });

  useEffect(() => {
    form.reset(siteSettings);
  }, [siteSettings, form]);

  const handleSaveSiteSettings = async (data: SiteSettings) => {
    setIsSaving(true);
    try {
      const payload = { ...data };
      // If maintenance mode changed, include note
      if (typeof data.maintenanceMode === "boolean" && note.trim()) {
        payload.note = note.trim();
      }

      const success = await onSave("site_settings", payload);

      if (success) {
        setSiteSettings(data);
        form.reset(data);
        setNote("");
        toast.success("Site settings updated successfully");
      } else {
        toast.error("Failed to update site settings");
      }
    } catch (error) {
      console.error("Error saving site settings:", error);
      toast.error("Failed to update site settings");
    } finally {
      setIsSaving(false);
    }
  };

  // When user toggles maintenance mode, ask for note
  const handleMaintenanceToggle = (checked: boolean) => {
    setPendingMaintenanceMode(checked);
    setShowNoteDialog(true);
  };

  const confirmMaintenanceChange = () => {
    if (!note.trim()) {
      toast.error("Please enter a note for this maintenance change");
      return;
    }
    form.setValue("maintenanceMode", pendingMaintenanceMode ?? false);
    setShowNoteDialog(false);
  };

  const cancelMaintenanceChange = () => {
    setPendingMaintenanceMode(null);
    setShowNoteDialog(false);
    setNote("");
  };

  const hasErrors = Object.keys(form.formState.errors).length > 0;

  return (
    <>
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
            <form
              onSubmit={form.handleSubmit(handleSaveSiteSettings)}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {/* Site Name */}
                  <FormField
                    control={form.control}
                    name="siteName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your site name" {...field} />
                        </FormControl>
                        <FormDescription>
                          Appears in the browser tab
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Site Description */}
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
                          Appears in search engines and social media
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  {/* Currency */}
                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency</FormLabel>
                        <FormControl>
                          <Input placeholder="TZS" {...field} />
                        </FormControl>
                        <FormDescription>
                          The currency code (e.g. TZS, USD)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Maintenance Mode */}
                  <FormField
                    control={form.control}
                    name="maintenanceMode"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Maintenance Mode
                            </FormLabel>
                            <FormDescription>
                              Temporarily disable the site for maintenance
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={handleMaintenanceToggle}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Save */}
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

              {hasErrors && (
                <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                  <AlertCircle className="w-4 h-4" />
                  Please fix all validation errors before saving
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Maintenance Note Dialog */}
      <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wrench className="w-5 h-5" />
              Maintenance Mode Change
            </DialogTitle>
            <DialogDescription>
              Please provide a note explaining why maintenance mode is being{" "}
              {pendingMaintenanceMode ? "enabled" : "disabled"}.
            </DialogDescription>
          </DialogHeader>

          <Textarea
            placeholder="Enter maintenance reason..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
          />

          <DialogFooter className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={cancelMaintenanceChange}>
              <XCircle className="w-4 h-4 mr-1" /> Cancel
            </Button>
            <Button onClick={confirmMaintenanceChange}>
              <CheckCircle2 className="w-4 h-4 mr-1" /> Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
