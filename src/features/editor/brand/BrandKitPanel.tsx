'use client';

import { useState, useEffect } from 'react';
import { Plus, X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BrandKit,
  BrandFont,
  DEFAULT_BRAND_COLORS,
  GOOGLE_FONTS_SAMPLE,
} from './brand-types';

interface BrandKitPanelProps {
  onSave?: (kit: BrandKit) => void;
  onApply?: (kit: BrandKit) => void;
}

const BrandKitPanel = ({ onSave, onApply }: BrandKitPanelProps) => {
  const [brandName, setBrandName] = useState('My Brand');
  const [colors, setColors] = useState<string[]>(DEFAULT_BRAND_COLORS);
  const [selectedFonts, setSelectedFonts] = useState<BrandFont[]>([]);
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [newColor, setNewColor] = useState('#3B82F6');

  // Load brand kit from localStorage on mount
  useEffect(() => {
    const savedKit = localStorage.getItem('brandKit');
    if (savedKit) {
      try {
        const kit = JSON.parse(savedKit) as BrandKit;
        setBrandName(kit.name);
        setColors(kit.colors);
        setSelectedFonts(kit.fonts);
        setLogoUrl(kit.logoUrl || '');
      } catch (e) {
        console.error('Failed to load brand kit:', e);
      }
    }
  }, []);

  const handleAddColor = () => {
    if (newColor && !colors.includes(newColor)) {
      setColors([...colors, newColor]);
      setNewColor('#3B82F6');
    }
  };

  const handleRemoveColor = (colorToRemove: string) => {
    setColors(colors.filter((c) => c !== colorToRemove));
  };

  const handleAddFont = (font: BrandFont) => {
    if (!selectedFonts.find((f) => f.name === font.name)) {
      setSelectedFonts([...selectedFonts, font]);
    }
  };

  const handleRemoveFont = (fontName: string) => {
    setSelectedFonts(selectedFonts.filter((f) => f.name !== fontName));
  };

  const handleSaveBrandKit = () => {
    const kit: BrandKit = {
      id: `kit_${Date.now()}`,
      name: brandName,
      colors,
      fonts: selectedFonts,
      logoUrl: logoUrl || undefined,
      createdAt: Date.now(),
    };

    localStorage.setItem('brandKit', JSON.stringify(kit));
    onSave?.(kit);
  };

  const handleApplyBrandKit = () => {
    const kit: BrandKit = {
      id: `kit_${Date.now()}`,
      name: brandName,
      colors,
      fonts: selectedFonts,
      logoUrl: logoUrl || undefined,
    };

    onApply?.(kit);
  };

  return (
    <div className="w-full h-full flex flex-col pb-4">
      {/* Brand Name */}
      <div className="px-4 pt-4 border-b border-border pb-4">
        <label className="text-xs font-medium text-muted-foreground mb-2 block">
          Brand Name
        </label>
        <Input
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
          placeholder="Enter brand name"
          className="text-sm"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="colors" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 mb-4 mx-4 mt-4">
          <TabsTrigger value="colors" className="text-xs">
            Colors
          </TabsTrigger>
          <TabsTrigger value="fonts" className="text-xs">
            Fonts
          </TabsTrigger>
          <TabsTrigger value="logo" className="text-xs">
            Logo
          </TabsTrigger>
        </TabsList>

        {/* Colors Tab */}
        <TabsContent value="colors" className="flex-1 overflow-y-auto px-4">
          <div className="space-y-3">
            {/* Color List */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                Brand Colors
              </label>
              <div className="grid grid-cols-4 gap-2">
                {colors.map((color) => (
                  <div
                    key={color}
                    className="relative group rounded-lg overflow-hidden"
                  >
                    <div
                      className="w-full h-12 rounded-lg border-2 border-border cursor-pointer hover:border-primary transition-colors"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                    <button
                      onClick={() => handleRemoveColor(color)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity touch-target"
                      aria-label="Remove color"
                    >
                      <X size={12} />
                    </button>
                    <span className="text-xs text-muted-foreground mt-1 block text-center truncate">
                      {color}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Color */}
            <div className="space-y-2 pt-4 border-t border-border">
              <label className="text-xs font-medium text-muted-foreground">
                Add New Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  className="h-10 w-12 rounded-lg cursor-pointer border border-border"
                />
                <Button
                  onClick={handleAddColor}
                  size="sm"
                  variant="outline"
                  className="flex-1"
                >
                  <Plus size={16} className="mr-1" />
                  Add
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Fonts Tab */}
        <TabsContent value="fonts" className="flex-1 overflow-y-auto px-4">
          <div className="space-y-3">
            {/* Selected Fonts */}
            {selectedFonts.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">
                  Selected Fonts
                </label>
                <div className="space-y-2">
                  {selectedFonts.map((font) => (
                    <div
                      key={font.name}
                      className="flex items-center justify-between p-2 rounded-lg bg-muted/50 border border-border"
                    >
                      <div>
                        <p className="text-sm font-medium">{font.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {font.category}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveFont(font.name)}
                        className="text-red-500 hover:bg-red-500/10 p-1 rounded transition-colors touch-target"
                        aria-label="Remove font"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Available Fonts */}
            <div className="space-y-2 pt-4 border-t border-border">
              <label className="text-xs font-medium text-muted-foreground">
                Google Fonts
              </label>
              <div className="grid grid-cols-2 gap-2">
                {GOOGLE_FONTS_SAMPLE.map((font) => (
                  <button
                    key={font.name}
                    onClick={() => handleAddFont(font)}
                    disabled={selectedFonts.some((f) => f.name === font.name)}
                    className={`p-3 rounded-lg transition-all text-sm touch-target ${
                      selectedFonts.some((f) => f.name === font.name)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80 border border-border'
                    } disabled:opacity-70`}
                  >
                    <div className="font-medium">{font.name}</div>
                    <div className="text-xs opacity-75">{font.category}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Logo Tab */}
        <TabsContent value="logo" className="flex-1 overflow-y-auto px-4">
          <div className="space-y-3">
            {logoUrl && (
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">
                  Current Logo
                </label>
                <div className="relative w-full h-32 rounded-lg border-2 border-border overflow-hidden bg-muted/50 flex items-center justify-center">
                  <img
                    src={logoUrl}
                    alt="Brand logo"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <Button
                  onClick={() => setLogoUrl('')}
                  variant="destructive"
                  size="sm"
                  className="w-full"
                >
                  Remove Logo
                </Button>
              </div>
            )}

            {!logoUrl && (
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">
                  Upload Logo
                </label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Tap to upload a logo image
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG, or SVG
                  </p>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="space-y-2 px-4 pt-4 border-t border-border">
        <Button
          onClick={handleSaveBrandKit}
          className="w-full"
          variant="outline"
        >
          Save Brand Kit
        </Button>
        <Button onClick={handleApplyBrandKit} className="w-full">
          Apply to Project
        </Button>
      </div>
    </div>
  );
};

export default BrandKitPanel;
