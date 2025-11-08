// app/admin/components/FAQTab.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Save, FileText, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { FAQItem, SupportInfo, SetSupportInfo } from './types';

interface FAQTabProps {
  supportInfo: SupportInfo;
  setSupportInfo: SetSupportInfo;
}

export default function FAQTab({ supportInfo, setSupportInfo }: FAQTabProps) {
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
      toast.success('FAQ updated successfully');
    } else {
      toast.error('Failed to update FAQ');
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

  return (
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
  );
}