import { useState } from 'react';
import { SupportInfo, FAQItem } from './types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Languages, FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface FAQTabProps {
  supportInfo: SupportInfo;
  setSupportInfo: (info: SupportInfo) => void;
  onSave: (type: 'support', data: SupportInfo) => Promise<boolean>;
  isSaving: boolean;
}

export default function FAQTab({ 
  supportInfo, 
  setSupportInfo, 
  onSave,
  isSaving 
}: FAQTabProps) {
  const [isDirty, setIsDirty] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState<'en' | 'sw'>('en');

  const handleSave = async () => {
    const success = await onSave('support', supportInfo);
    if (success) {
      setIsDirty(false);
    }
  };

  const addFAQ = () => {
    const newFAQ: FAQItem = {
      id: Date.now().toString(),
      question: { en: '', sw: '' },
      answer: { en: '', sw: '' }
    };
    
    setSupportInfo({
      ...supportInfo,
      faq: [...supportInfo.faq, newFAQ]
    });
    setIsDirty(true);
  };

  const removeFAQ = (id: string) => {
    setSupportInfo({
      ...supportInfo,
      faq: supportInfo.faq.filter(item => item.id !== id)
    });
    setIsDirty(true);
  };

  const updateFAQ = (id: string, field: 'question' | 'answer', language: 'en' | 'sw', value: string) => {
    setSupportInfo({
      ...supportInfo,
      faq: supportInfo.faq.map(item => 
        item.id === id 
          ? {
              ...item,
              [field]: {
                ...item[field],
                [language]: value
              }
            }
          : item
      )
    });
    setIsDirty(true);
  };

  const moveFAQ = (index: number, direction: 'up' | 'down') => {
    const newFAQ = [...supportInfo.faq];
    
    if (direction === 'up' && index > 0) {
      [newFAQ[index - 1], newFAQ[index]] = [newFAQ[index], newFAQ[index - 1]];
    } else if (direction === 'down' && index < newFAQ.length - 1) {
      [newFAQ[index + 1], newFAQ[index]] = [newFAQ[index], newFAQ[index + 1]];
    }
    
    setSupportInfo({
      ...supportInfo,
      faq: newFAQ
    });
    setIsDirty(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Manage FAQ content in both English and Swahili
              </CardDescription>
            </div>
            <Button onClick={addFAQ} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add FAQ
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Language Toggle */}
          <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Languages className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Editing Language:</span>
            <Tabs value={activeLanguage} onValueChange={(value) => setActiveLanguage(value as 'en' | 'sw')}>
              <TabsList className="grid w-32 grid-cols-2">
                <TabsTrigger value="en">English</TabsTrigger>
                <TabsTrigger value="sw">Swahili</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* FAQ Items */}
          {supportInfo.faq.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No FAQ items yet. Click &quot;Add FAQ&quot; to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {supportInfo.faq.map((faq, index) => (
                <Card key={faq.id} className="relative">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {index + 1}
                        </span>
                        <h3 className="font-medium">FAQ Item {index + 1}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Move buttons */}
                        <div className="flex items-center gap-1 mr-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => moveFAQ(index, 'up')}
                            disabled={index === 0}
                            className="h-8 w-8 p-0"
                          >
                            ↑
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => moveFAQ(index, 'down')}
                            disabled={index === supportInfo.faq.length - 1}
                            className="h-8 w-8 p-0"
                          >
                            ↓
                          </Button>
                        </div>
                        
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeFAQ(faq.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Question */}
                      <div className="space-y-2">
                        <Label htmlFor={`question-${faq.id}`}>
                          Question ({activeLanguage === 'en' ? 'English' : 'Swahili'})
                        </Label>
                        <Input
                          id={`question-${faq.id}`}
                          value={faq.question[activeLanguage]}
                          onChange={(e) => updateFAQ(faq.id, 'question', activeLanguage, e.target.value)}
                          placeholder={
                            activeLanguage === 'en' 
                              ? 'Enter question in English...' 
                              : 'Weka swali kwa Kiswahili...'
                          }
                        />
                        {/* Language preview */}
                        <div className="flex gap-2 text-xs text-gray-500">
                          <span className={faq.question.en ? 'text-green-600' : ''}>
                            EN: {faq.question.en || 'Not set'}
                          </span>
                          <span className={faq.question.sw ? 'text-green-600' : ''}>
                            SW: {faq.question.sw || 'Hajaseti'}
                          </span>
                        </div>
                      </div>

                      {/* Answer */}
                      <div className="space-y-2">
                        <Label htmlFor={`answer-${faq.id}`}>
                          Answer ({activeLanguage === 'en' ? 'English' : 'Swahili'})
                        </Label>
                        <Textarea
                          id={`answer-${faq.id}`}
                          value={faq.answer[activeLanguage]}
                          onChange={(e) => updateFAQ(faq.id, 'answer', activeLanguage, e.target.value)}
                          placeholder={
                            activeLanguage === 'en' 
                              ? 'Enter answer in English...' 
                              : 'Weka jibu kwa Kiswahili...'
                          }
                          rows={3}
                        />
                        {/* Language preview */}
                        <div className="flex gap-2 text-xs text-gray-500">
                          <span className={faq.answer.en ? 'text-green-600' : ''}>
                            EN: {faq.answer.en ? `${faq.answer.en.substring(0, 50)}...` : 'Not set'}
                          </span>
                          <span className={faq.answer.sw ? 'text-green-600' : ''}>
                            SW: {faq.answer.sw ? `${faq.answer.sw.substring(0, 50)}...` : 'Hajaseti'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Save Button */}
          {supportInfo.faq.length > 0 && (
            <div className="flex justify-end pt-4 border-t">
              <Button 
                onClick={handleSave} 
                disabled={!isDirty || isSaving}
                className="min-w-32"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Card */}
      {supportInfo.faq.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>FAQ Preview</CardTitle>
            <CardDescription>
              How your FAQ will appear to users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="en">
              <TabsList className="mb-4">
                <TabsTrigger value="en">English Preview</TabsTrigger>
                <TabsTrigger value="sw">Swahili Preview</TabsTrigger>
              </TabsList>
              
              <TabsContent value="en" className="space-y-4">
                {supportInfo.faq.map((faq, index) => (
                  <div key={faq.id} className="border rounded-lg p-4">
                    <h4 className="font-semibold text-blue-600 mb-2">
                      Q{index + 1}: {faq.question.en || 'Question not set'}
                    </h4>
                    <p className="text-gray-700">
                      {faq.answer.en || 'Answer not set'}
                    </p>
                  </div>
                ))}
              </TabsContent>
              
              <TabsContent value="sw" className="space-y-4">
                {supportInfo.faq.map((faq, index) => (
                  <div key={faq.id} className="border rounded-lg p-4">
                    <h4 className="font-semibold text-blue-600 mb-2">
                      Q{index + 1}: {faq.question.sw || 'Swali halijaseti'}
                    </h4>
                    <p className="text-gray-700">
                      {faq.answer.sw || 'Jibu halijaseti'}
                    </p>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}