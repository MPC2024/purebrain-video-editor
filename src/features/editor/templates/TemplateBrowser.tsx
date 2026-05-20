'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { TEMPLATES, TEMPLATE_CATEGORIES, VideoTemplate } from './template-data';
import { Clock } from 'lucide-react';

interface TemplateBrowserProps {
  onTemplateSelect?: (template: VideoTemplate) => void;
}

const TemplateBrowser = ({ onTemplateSelect }: TemplateBrowserProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleSelectTemplate = (template: VideoTemplate) => {
    setSelectedTemplate(template.id);
    onTemplateSelect?.(template);
  };

  const getAspectRatioLabel = (ratio: string) => {
    const labels: Record<string, string> = {
      '16:9': 'Landscape',
      '9:16': 'Portrait',
      '1:1': 'Square',
    };
    return labels[ratio] || ratio;
  };

  return (
    <div className="w-full h-full flex flex-col">
      <Tabs defaultValue="intro" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-6 mb-4">
          {TEMPLATE_CATEGORIES.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="text-xs">
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {TEMPLATE_CATEGORIES.map((category) => {
          const categoryTemplates = TEMPLATES.filter(
            (t) => t.category === category.id,
          );

          return (
            <TabsContent
              key={category.id}
              value={category.id}
              className="flex-1 overflow-y-auto"
            >
              <div className="grid grid-cols-2 gap-3 pb-4">
                {categoryTemplates.map((template) => (
                  <div
                    key={template.id}
                    className={`flex flex-col rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      selectedTemplate === template.id
                        ? 'border-primary ring-2 ring-primary/50'
                        : 'border-border hover:border-muted-foreground'
                    }`}
                  >
                    {/* Preview Thumbnail */}
                    <div
                      className="w-full aspect-video bg-cover bg-center"
                      style={{
                        background: template.gradient,
                      }}
                    />

                    {/* Template Info */}
                    <div className="p-3 space-y-2">
                      <h4 className="text-sm font-semibold truncate">
                        {template.name}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {template.description}
                      </p>

                      {/* Metadata */}
                      <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          {template.duration}s
                        </div>
                        <span className="text-xs px-2 py-0.5 bg-muted rounded">
                          {getAspectRatioLabel(template.aspectRatio)}
                        </span>
                      </div>

                      {/* Use Template Button */}
                      <Button
                        size="sm"
                        onClick={() => handleSelectTemplate(template)}
                        variant={
                          selectedTemplate === template.id ? 'default' : 'outline'
                        }
                        className="w-full h-8 mt-2"
                      >
                        {selectedTemplate === template.id
                          ? 'Using Template'
                          : 'Use Template'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {categoryTemplates.length === 0 && (
                <div className="flex items-center justify-center h-32 text-muted-foreground">
                  No templates in this category
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};

export default TemplateBrowser;
