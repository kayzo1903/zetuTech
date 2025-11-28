"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { LucideLoader, Send } from "lucide-react";

// ---------------------------
// ZOD SCHEMA
// ---------------------------
const MessageSchema = z.object({
  name: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(3, "Subject is too short"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type MessageFormType = z.infer<typeof MessageSchema>;

interface MessageFormProps {
  type: "support" | "contact";
}

export default function MessageForm({ type }: MessageFormProps) {
  const form = useForm<MessageFormType>({
    resolver: zodResolver(MessageSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  async function onSubmit(values: MessageFormType) {
    try {
      const res = await fetch("/api/messages/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          ...values,
        }),
      });

      if (!res.ok) {
        toast.error("Submission Failed", {
          description: "Something went wrong. Please try again.",
        });
        return;
      }

      toast.success("Message Sent!", {
        description:
          type === "support"
            ? "Your support ticket was submitted."
            : "Your message has been delivered.",
      });

      form.reset();
    } catch {
      toast.error("Network Error", {
        description: "Please check your internet connection and try again.",
      });
    }
  }

  return (
    <div className="max-w-2xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Full Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Subject */}
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder={
                      type === "support"
                        ? "Enter the subject of your support request"
                        : "Enter your message subject"
                    }
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Message */}
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea
                    rows={5}
                    placeholder={
                      type === "support"
                        ? "Describe your issue in detail..."
                        : "Write your message..."
                    }
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full flex items-center justify-center gap-2"
            disabled={form.formState.isSubmitting}
          >
            <Send className="w-4 h-4" />
            {form.formState.isSubmitting ? <LucideLoader /> : "Send Message"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
