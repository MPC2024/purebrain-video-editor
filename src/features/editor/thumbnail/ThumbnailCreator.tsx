'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
// @ts-ignore
import { fabric } from 'fabric';
import {
  Type,
  Image as ImageIcon,
  Square,
  Circle,
  Triangle,
  Copy,
  Download,
  Trash2,
  Undo2,
  Redo2,
  Palette,
  Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { BrandKit, DEFAULT_BRAND_COLORS } from '../brand/brand-types';

interface ThumbnailSize {
  name: string;
  width: number;
  height: number;
  description: string;
}

const THUMBNAIL_SIZES: ThumbnailSize[] = [
  {
    name: 'YouTube Thumbnail',
    width: 1280,
    height: 720,
    description: '1280x720 (16:9)',
  },
  {
    name: 'Instagram Post',
    width: 1080,
    height: 1080,
    description: '1080x1080 (1:1)',
  },
  {
    name: 'TikTok Cover',
    width: 1080,
    height: 1920,
    description: '1080x1920 (9:16)',
  },
  {
    name: 'Instagram Reel',
    width: 1080,
    height: 1920,
    description: '1080x1920 (9:16)',
  },
];

const TEMPLATES = [
  {
    id: 'bold-title',
    name: 'Bold Title',
    description: 'Large text centered with color background',
    apply: (canvas: fabric.Canvas, brandKit?: BrandKit) => {
      canvas.clear();
      const bgColor = brandKit?.colors?.[0] || '#FF6B35';
      canvas.setBackgroundColor(bgColor, canvas.renderAll.bind(canvas));

      const text = new fabric.IText('Your Title Here', {
        left: canvas.width! / 2,
        top: canvas.height! / 2 - 40,
        fontSize: 72,
        fontWeight: 'bold',
        fill: '#FFFFFF',
        textAlign: 'center',
        originX: 'center',
        originY: 'center',
        fontFamily: 'Arial',
      });
      canvas.add(text);
      canvas.renderAll();
    },
  },
  {
    id: 'photo-text',
    name: 'Photo + Text',
    description: 'Image on left, text on right',
    apply: (canvas: fabric.Canvas, brandKit?: BrandKit) => {
      canvas.clear();
      canvas.setBackgroundColor('#FFFFFF', canvas.renderAll.bind(canvas));

      // Placeholder for image
      const rect = new fabric.Rect({
        left: 20,
        top: canvas.height! / 2 - 100,
        width: 200,
        height: 200,
        fill: '#E0E0E0',
        stroke: '#999999',
        strokeWidth: 2,
      });
      canvas.add(rect);

      const text = new fabric.IText('Add your text here', {
        left: 250,
        top: canvas.height! / 2 - 60,
        fontSize: 48,
        fontWeight: 'bold',
        fill: '#000000',
        fontFamily: 'Arial',
      });
      canvas.add(text);
      canvas.renderAll();
    },
  },
  {
    id: 'before-after',
    name: 'Before/After',
    description: 'Split layout with two images',
    apply: (canvas: fabric.Canvas, brandKit?: BrandKit) => {
      canvas.clear();
      canvas.setBackgroundColor('#FFFFFF', canvas.renderAll.bind(canvas));

      const midX = canvas.width! / 2;

      // Before box
      const beforeRect = new fabric.Rect({
        left: 10,
        top: 20,
        width: midX - 20,
        height: canvas.height! - 40,
        fill: '#F5F5F5',
        stroke: '#CCCCCC',
        strokeWidth: 2,
      });
      canvas.add(beforeRect);

      const beforeText = new fabric.Text('BEFORE', {
        left: midX / 2,
        top: 40,
        fontSize: 32,
        fontWeight: 'bold',
        fill: '#333333',
        textAlign: 'center',
        originX: 'center',
      });
      canvas.add(beforeText);

      // After box
      const afterRect = new fabric.Rect({
        left: midX + 10,
        top: 20,
        width: midX - 20,
        height: canvas.height! - 40,
        fill: brandKit?.colors?.[0] || '#FF6B35',
        stroke: '#999999',
        strokeWidth: 2,
      });
      canvas.add(afterRect);

      const afterText = new fabric.Text('AFTER', {
        left: midX + midX / 2,
        top: 40,
        fontSize: 32,
        fontWeight: 'bold',
        fill: '#FFFFFF',
        textAlign: 'center',
        originX: 'center',
      });
      canvas.add(afterText);

      canvas.renderAll();
    },
  },
  {
    id: 'gradient-overlay',
    name: 'Gradient Overlay',
    description: 'Image with gradient text overlay',
    apply: (canvas: fabric.Canvas, brandKit?: BrandKit) => {
      canvas.clear();
      canvas.setBackgroundColor('#FFFFFF', canvas.renderAll.bind(canvas));

      // Background rectangle (simulates image)
      const bgRect = new fabric.Rect({
        left: 0,
        top: 0,
        width: canvas.width,
        height: canvas.height,
        fill: '#666666',
      });
      canvas.add(bgRect);
      canvas.sendToBack(bgRect);

      // Overlay rectangle
      const overlay = new fabric.Rect({
        left: 0,
        top: canvas.height! / 2,
        width: canvas.width,
        height: canvas.height! / 2,
        fill: 'rgba(0, 0, 0, 0.5)',
      });
      canvas.add(overlay);

      const text = new fabric.IText('Your Headline', {
        left: canvas.width! / 2,
        top: canvas.height! * 0.65,
        fontSize: 56,
        fontWeight: 'bold',
        fill: '#FFFFFF',
        textAlign: 'center',
        originX: 'center',
        fontFamily: 'Arial',
      });
      canvas.add(text);
      canvas.renderAll();
    },
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean white with small text and image',
    apply: (canvas: fabric.Canvas, brandKit?: BrandKit) => {
      canvas.clear();
      canvas.setBackgroundColor('#FFFFFF', canvas.renderAll.bind(canvas));

      // Small accent bar
      const accent = new fabric.Rect({
        left: 0,
        top: 0,
        width: 8,
        height: canvas.height,
        fill: brandKit?.colors?.[0] || '#FF6B35',
      });
      canvas.add(accent);

      const text = new fabric.IText('Minimal Design', {
        left: 40,
        top: canvas.height! / 2 - 40,
        fontSize: 42,
        fontWeight: 'bold',
        fill: '#000000',
        fontFamily: 'Arial',
      });
      canvas.add(text);

      const subtext = new fabric.Text('Elegant and clean', {
        left: 40,
        top: canvas.height! / 2 + 20,
        fontSize: 24,
        fill: '#666666',
        fontFamily: 'Arial',
      });
      canvas.add(subtext);

      canvas.renderAll();
    },
  },
];

const ThumbnailCreator: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef<number>(-1);

  const [size, setSize] = useState<ThumbnailSize>(THUMBNAIL_SIZES[0]);
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [selectedFont, setSelectedFont] = useState('Arial');
  const [selectedFontSize, setSelectedFontSize] = useState(24);
  const [selectedTextColor, setSelectedTextColor] = useState('#000000');
  const [brandKit, setBrandKit] = useState<BrandKit | null>(null);

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: size.width,
      height: size.height,
      backgroundColor: bgColor,
    });

    fabricCanvasRef.current = canvas;

    // Save state on object changes
    const saveState = () => {
      const state = JSON.stringify(canvas.toJSON());
      historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
      historyRef.current.push(state);
      historyIndexRef.current++;
    };

    canvas.on('object:added', saveState);
    canvas.on('object:modified', saveState);
    canvas.on('object:removed', saveState);

    // Load brand kit from localStorage
    const savedBrandKit = localStorage.getItem('brandKit');
    if (savedBrandKit) {
      try {
        const kit = JSON.parse(savedBrandKit) as BrandKit;
        setBrandKit(kit);
      } catch (e) {
        console.error('Failed to load brand kit:', e);
      }
    }

    return () => {
      canvas.dispose();
    };
  }, []);

  // Handle canvas resize
  useEffect(() => {
    if (!fabricCanvasRef.current) return;

    fabricCanvasRef.current.setWidth(size.width);
    fabricCanvasRef.current.setHeight(size.height);
    fabricCanvasRef.current.renderAll();
  }, [size]);

  // Handle background color change
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    fabricCanvasRef.current.setBackgroundColor(bgColor, () => {
      fabricCanvasRef.current?.renderAll();
    });
  }, [bgColor]);

  const saveState = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    const state = JSON.stringify(fabricCanvasRef.current.toJSON());
    historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
    historyRef.current.push(state);
    historyIndexRef.current++;
  }, []);

  const addText = () => {
    if (!fabricCanvasRef.current) return;

    const text = new fabric.IText('Edit Me', {
      left: 100,
      top: 100,
      fontSize: selectedFontSize,
      fill: selectedTextColor,
      fontFamily: selectedFont,
      fontWeight: 'bold',
    });

    fabricCanvasRef.current.add(text);
    fabricCanvasRef.current.setActiveObject(text);
    fabricCanvasRef.current.renderAll();
    saveState();
  };

  const addImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!fabricCanvasRef.current || !e.target.files?.[0]) return;

    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const imgUrl = event.target?.result as string;
      fabric.Image.fromURL(
        imgUrl,
        (img: any) => {
          img.scaleToWidth(200);
          img.set({ left: 100, top: 100 });
          fabricCanvasRef.current!.add(img);
          fabricCanvasRef.current!.renderAll();
          saveState();
        },
        { crossOrigin: 'anonymous' }
      );
    };

    reader.readAsDataURL(file);
  };

  const addShape = (shapeType: 'rect' | 'circle' | 'triangle') => {
    if (!fabricCanvasRef.current) return;

    let shape: fabric.Object;

    switch (shapeType) {
      case 'rect':
        shape = new fabric.Rect({
          left: 100,
          top: 100,
          width: 150,
          height: 100,
          fill: selectedTextColor,
          stroke: '#000000',
          strokeWidth: 2,
        });
        break;
      case 'circle':
        shape = new fabric.Circle({
          left: 100,
          top: 100,
          radius: 60,
          fill: selectedTextColor,
          stroke: '#000000',
          strokeWidth: 2,
        });
        break;
      case 'triangle':
        shape = new fabric.Triangle({
          left: 100,
          top: 100,
          width: 120,
          height: 120,
          fill: selectedTextColor,
          stroke: '#000000',
          strokeWidth: 2,
        });
        break;
    }

    fabricCanvasRef.current.add(shape);
    fabricCanvasRef.current.renderAll();
    saveState();
  };

  const deleteObject = () => {
    if (!fabricCanvasRef.current) return;

    const activeObject = fabricCanvasRef.current.getActiveObject();
    if (activeObject) {
      fabricCanvasRef.current.remove(activeObject);
      fabricCanvasRef.current.renderAll();
      saveState();
    }
  };

  const undo = () => {
    if (historyIndexRef.current > 0 && fabricCanvasRef.current) {
      historyIndexRef.current--;
      const state = historyRef.current[historyIndexRef.current];
      fabricCanvasRef.current.loadFromJSON(state, () => {
        fabricCanvasRef.current?.renderAll();
      });
    }
  };

  const redo = () => {
    if (
      historyIndexRef.current < historyRef.current.length - 1 &&
      fabricCanvasRef.current
    ) {
      historyIndexRef.current++;
      const state = historyRef.current[historyIndexRef.current];
      fabricCanvasRef.current.loadFromJSON(state, () => {
        fabricCanvasRef.current?.renderAll();
      });
    }
  };

  const exportImage = (format: 'png' | 'jpeg') => {
    if (!fabricCanvasRef.current) return;

    const dataURL = fabricCanvasRef.current.toDataURL({
      format: format,
      quality: 1,
    });

    const link = document.createElement('a');
    link.href = dataURL;
    link.download = `thumbnail.${format}`;
    link.click();

    toast.success(`Thumbnail downloaded as ${format.toUpperCase()}`);
  };

  const copyToClipboard = async () => {
    if (!fabricCanvasRef.current) return;

    try {
      const canvas = fabricCanvasRef.current.getElement() as HTMLCanvasElement;
      canvas.toBlob((blob) => {
        if (!blob) return;
        navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ]);
        toast.success('Thumbnail copied to clipboard');
      });
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error('Failed to copy to clipboard');
    }
  };

  const applyTemplate = (templateId: string) => {
    const template = TEMPLATES.find((t) => t.id === templateId);
    if (template && fabricCanvasRef.current) {
      template.apply(fabricCanvasRef.current, brandKit || undefined);
      saveState();
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Toolbar */}
      <div className="border-b border-border p-3 flex flex-col gap-3">
        {/* Size selector */}
        <div>
          <Label className="text-xs mb-2 block">Template Size</Label>
          <Select value={size.name} onValueChange={(value) => {
            const selected = THUMBNAIL_SIZES.find((s) => s.name === value);
            if (selected) setSize(selected);
          }}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {THUMBNAIL_SIZES.map((s) => (
                <SelectItem key={s.name} value={s.name}>
                  {s.name} ({s.description})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Quick actions */}
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={addText}
            className="gap-1 text-xs"
          >
            <Type size={14} />
            Text
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => document.getElementById('image-upload')?.click()}
            className="gap-1 text-xs"
          >
            <ImageIcon size={14} />
            Image
          </Button>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={addImage}
            className="hidden"
          />
          <Button
            size="sm"
            variant="outline"
            onClick={() => addShape('rect')}
            className="gap-1 text-xs"
          >
            <Square size={14} />
            Box
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => addShape('circle')}
            className="gap-1 text-xs"
          >
            <Circle size={14} />
            Circle
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={deleteObject}
            className="gap-1 text-xs text-red-600"
          >
            <Trash2 size={14} />
            Delete
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={undo}
            className="gap-1 text-xs"
          >
            <Undo2 size={14} />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={redo}
            className="gap-1 text-xs"
          >
            <Redo2 size={14} />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="design" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="design" className="text-xs">Design</TabsTrigger>
          <TabsTrigger value="templates" className="text-xs">Templates</TabsTrigger>
          <TabsTrigger value="export" className="text-xs">Export</TabsTrigger>
        </TabsList>

        {/* Design Tab */}
        <TabsContent value="design" className="flex-1 overflow-y-auto flex flex-col gap-3 p-3">
          <div className="space-y-2">
            <Label className="text-xs">Background Color</Label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="h-8 w-12 rounded-lg cursor-pointer border border-border"
              />
              <span className="text-xs text-muted-foreground">{bgColor}</span>
            </div>
          </div>

          <div className="space-y-2 border-t border-border pt-3">
            <Label className="text-xs">Text Font</Label>
            <Select value={selectedFont} onValueChange={setSelectedFont}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Arial">Arial</SelectItem>
                <SelectItem value="Georgia">Georgia</SelectItem>
                <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                <SelectItem value="Courier New">Courier New</SelectItem>
                <SelectItem value="Verdana">Verdana</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Font Size</Label>
            <input
              type="range"
              min="8"
              max="96"
              value={selectedFontSize}
              onChange={(e) => setSelectedFontSize(Number(e.target.value))}
              className="w-full"
            />
            <span className="text-xs text-muted-foreground">{selectedFontSize}px</span>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Text Color</Label>
            <div className="flex gap-2 flex-wrap">
              {[...DEFAULT_BRAND_COLORS, brandKit?.colors || []].flat().map((color) => (
                <button
                  key={color}
                  className={`w-6 h-6 rounded-lg border-2 ${
                    selectedTextColor === color ? 'border-primary' : 'border-border'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedTextColor(color)}
                  title={color}
                />
              ))}
              <input
                type="color"
                value={selectedTextColor}
                onChange={(e) => setSelectedTextColor(e.target.value)}
                className="h-6 w-12 rounded-lg cursor-pointer border border-border"
              />
            </div>
          </div>

          {brandKit && (
            <div className="space-y-2 border-t border-border pt-3">
              <Label className="text-xs">Brand Kit: {brandKit.name}</Label>
              <div className="flex gap-2 flex-wrap">
                {brandKit.colors.map((color) => (
                  <button
                    key={color}
                    className="w-8 h-8 rounded-lg border-2 border-border hover:border-primary transition-colors"
                    style={{ backgroundColor: color }}
                    onClick={() => setBgColor(color)}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="flex-1 overflow-y-auto p-3">
          <ScrollArea className="h-full">
            <div className="space-y-2">
              {TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  onClick={() => applyTemplate(template.id)}
                  className="w-full p-3 rounded-lg border border-border hover:bg-muted text-left transition-colors"
                >
                  <div className="font-medium text-sm">{template.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {template.description}
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Export Tab */}
        <TabsContent value="export" className="flex-1 overflow-y-auto p-3 space-y-2">
          <Button
            onClick={() => exportImage('png')}
            className="w-full gap-2"
          >
            <Download size={16} />
            Download as PNG
          </Button>
          <Button
            onClick={() => exportImage('jpeg')}
            variant="outline"
            className="w-full gap-2"
          >
            <Download size={16} />
            Download as JPEG
          </Button>
          <Button
            onClick={copyToClipboard}
            variant="outline"
            className="w-full gap-2"
          >
            <Copy size={16} />
            Copy to Clipboard
          </Button>
        </TabsContent>
      </Tabs>

      {/* Canvas */}
      <div className="flex-1 flex items-center justify-center p-4 bg-muted overflow-auto">
        <div className="bg-white rounded-lg shadow-lg">
          <canvas
            ref={canvasRef}
            id="thumbnail-canvas"
            style={{
              border: '1px solid #ccc',
              cursor: 'crosshair',
              maxWidth: '100%',
              maxHeight: '100%',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ThumbnailCreator;
