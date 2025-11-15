"use client";

import { ShieldCheck, Phone, Mail, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export default function WarrantyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 
      dark:from-slate-900 dark:via-slate-950 dark:to-black 
      py-10 px-4">
      
      <div className="container mx-auto max-w-4xl">

        {/* Title Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-foreground mb-2">
            Warranty & Product Protection
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Learn more about how we protect your purchase and how to access warranty services.
          </p>
        </div>

        {/* Warranty Card */}
        <Card className="shadow-md border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <ShieldCheck className="w-6 h-6 text-blue-600" />
              Our Warranty Policy
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 text-sm leading-relaxed">
            <p>
              At <strong>zetuTech</strong>, all our electronics come with a minimum 
              <strong> 1-year standard warranty</strong> covering manufacturing defects, malfunctioning parts, 
              and hardware failures under normal use.
            </p>

            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Warranty applies only to products purchased through zetuTech.</li>
              <li>Damage caused by misuse, drops, or unauthorized repairs is not covered.</li>
              <li>Original receipt or order number is required for warranty service.</li>
              <li>Warranty repairs may take <strong>3–14 business days</strong> depending on the issue.</li>
            </ul>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Warranty FAQs</h2>

          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>How do I claim my warranty?</AccordionTrigger>
              <AccordionContent>
                Contact our support team using the details below. Provide your order number and a 
                description of the issue. We will guide you through the repair or replacement process.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>What is not covered by warranty?</AccordionTrigger>
              <AccordionContent>
                Warranty does not cover physical damage, water damage, unauthorized 
                repair attempts, or issues caused by incorrect usage.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>Do I get a replacement or repair?</AccordionTrigger>
              <AccordionContent>
                Depending on the issue, eligible products may be repaired or replaced 
                at no additional cost during the warranty period.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Contact Section */}
        <div className="mt-12 p-6 bg-muted rounded-xl shadow-sm">
          <h3 className="text-xl font-bold mb-4">Need Warranty Support?</h3>

          <div className="space-y-3 text-sm">
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4" /> +255 123 456 789
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4" /> support@zetutech.co.tz
            </p>
            <p className="flex items-center gap-2">
              <Clock className="w-4 h-4" /> Mon – Sat: 9:00 AM – 7:00 PM
            </p>
          </div>

          <Button className="mt-4">Contact Warranty Team</Button>
        </div>

      </div>
    </div>
  );
}