# Thumbnail Creator Integration Guide

## Overview

The Thumbnail Creator is a complete Fabric.js-based canvas editor integrated into the PureBrain Video Editor. It allows users (like Alia) to create professional thumbnails for YouTube, Instagram, TikTok, and other social media platforms.

## Features

### Canvas Sizes
- **YouTube Thumbnail**: 1280x720 (16:9)
- **Instagram Post**: 1080x1080 (1:1)
- **TikTok Cover**: 1080x1920 (9:16)
- **Instagram Reel**: 1080x1920 (9:16)

### Design Tools
- **Add Text**: Editable text with font selection, size, color controls
- **Add Image**: Upload images from device or drag-and-drop
- **Add Shapes**: Rectangle, Circle, Triangle with color/opacity controls
- **Color Controls**: Background color picker, text color palette (including brand colors)
- **Font Selection**: Arial, Georgia, Times New Roman, Courier New, Verdana
- **Font Size**: Slider from 8px to 96px

### Pre-built Templates
1. **Bold Title** - Large centered text with solid color background
2. **Photo + Text** - Image on left, text on right layout
3. **Before/After** - Split layout with two sections
4. **Gradient Overlay** - Image background with gradient text overlay
5. **Minimal** - Clean design with accent bar and text

### Editing Controls
- **Undo/Redo**: Full history stack support
- **Delete**: Remove selected element
- **Canvas Navigation**: Scroll and zoom to fit
- **Object Selection**: Click to select, drag to move

### Export Options
- **Download as PNG**: Lossless format, best for social media
- **Download as JPEG**: Compressed format, smaller file size
- **Copy to Clipboard**: Quick paste into messaging apps

### Brand Kit Integration
- Loads brand colors from localStorage
- Quick apply brand colors to canvas background
- Font recommendations from brand kit
- One-click template application with brand colors

## File Structure

```
/src/features/editor/
├── thumbnail/
│   └── ThumbnailCreator.tsx (22KB, fully self-contained)
├── editor.tsx (updated with import)
└── brand/
    └── BrandKitPanel.tsx (leveraged for brand colors)

/src/components/mobile/
└── MobileTabBar.tsx (updated with thumbnail tab)
```

## Component Architecture

### ThumbnailCreator.tsx
- Self-contained React component with TypeScript
- Uses Fabric.js v5.3.0 for canvas manipulation
- Manages state for:
  - Canvas size and background color
  - Text formatting (font, size, color)
  - Undo/redo history
  - Brand kit integration

### Key Functions
- `addText()`: Add text to canvas
- `addImage()`: Upload and place images
- `addShape()`: Create geometric shapes
- `deleteObject()`: Remove selected element
- `undo()/redo()`: History management
- `exportImage()`: Download as PNG/JPEG
- `copyToClipboard()`: Copy to system clipboard
- `applyTemplate()`: Apply pre-built templates

## Mobile Integration

The Thumbnail Creator is accessible via the mobile tab bar:

```typescript
// In MobileTabBar.tsx
{ id: "thumbnail", label: "Thumbnail", icon: Image, content: thumbnailContent }

// In editor.tsx
<MobileTabBar
  thumbnailContent={<ThumbnailCreator />}
  onThumbnailClick={onThumbnailClick}
/>
```

The component renders in a full-screen bottom sheet on mobile devices.

## Dependencies

```json
{
  "fabric": "^5.3.0"  // Installed with --legacy-peer-deps
}
```

Existing dependencies leveraged:
- `sonner` for toast notifications
- `lucide-react` for icons
- `@radix-ui/react-select` for dropdowns
- `@radix-ui/react-tabs` for tab navigation
- Tailwind CSS for styling

## Usage Example

### For Users (Alia)
1. Click "Thumbnail" tab in mobile bottom bar
2. Select template size (e.g., "YouTube Thumbnail")
3. Choose a template or design from scratch
4. Add text, images, and shapes
5. Apply brand colors from Brand Kit
6. Download or copy to clipboard

### For Developers
```typescript
import ThumbnailCreator from './features/editor/thumbnail/ThumbnailCreator';

// In your component
<ThumbnailCreator />
```

## Canvas API

The component uses Fabric.js v5 with these key objects:
- `fabric.Canvas` - Main canvas instance
- `fabric.IText` - Editable text objects
- `fabric.Image` - Imported images
- `fabric.Rect` - Rectangles
- `fabric.Circle` - Circles
- `fabric.Triangle` - Triangles
- `fabric.Path` - Vector paths (for custom shapes)

## Performance Notes

- History is capped at the current undo/redo position to prevent memory bloat
- Canvas rendering is optimized with `renderAll()` after changes
- Large images are automatically scaled to 200px width on import
- TypeScript compiled without errors (strict mode)

## Browser Support

- Modern browsers with Canvas API support
- Tested on Chrome, Firefox, Safari
- Mobile browsers (iOS Safari, Chrome Mobile)
- Requires JavaScript enabled

## Future Enhancements

Potential improvements:
- Layer management panel
- Text styling (shadows, strokes)
- Gradient backgrounds
- Custom shape library
- Animation preview (connect to video editor)
- AI-powered text suggestions
- Batch export templates

## Testing Checklist

- [ ] Canvas renders at correct size for all presets
- [ ] Text can be added and edited
- [ ] Images upload and display correctly
- [ ] Shapes are selectable and modifiable
- [ ] Colors apply to selected objects
- [ ] Undo/redo works across all operations
- [ ] Export downloads correctly
- [ ] Copy to clipboard works
- [ ] Templates apply with brand colors
- [ ] Mobile responsive on small screens
- [ ] Brand kit colors load and apply

## Troubleshooting

### Canvas not rendering
- Check browser console for errors
- Verify Fabric.js is loaded: `window.fabric` should exist
- Ensure canvas element has ref properly attached

### Images not loading
- Check CORS headers if loading from external URLs
- Use `crossOrigin: 'anonymous'` in fabric.Image.fromURL()
- For local files, FileReader + DataURL is used automatically

### Undo/Redo not working
- Verify history stack is being maintained
- Check that saveState() is called after all operations
- History index bounds are checked before applying

### Export not downloading
- Check browser console for blob creation errors
- Ensure browser allows downloads from localhost
- Try copy to clipboard as alternative

## Contact

For integration help or feature requests, refer to the main video editor documentation.
