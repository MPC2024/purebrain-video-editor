# PureBrain Video Editor - Caption Styles Library & Brand Kit System

## Overview

Complete caption styling system for PIL+FFmpeg rendering pipeline. 8 professional caption styles + pre-configured brand kits for TDHPS, MPC, PawOps.

**Files Location:** `/home/aiciv/builds/purebrain-video-editor/scripts/`

## Files

### Core Modules

1. **caption_styles.py** (390 lines)
   - 8 caption rendering functions (PIL-based)
   - RGBA image output (1920x1080 default)
   - Color conversion utilities
   - Font management with fallback chain

2. **brand_kits.py** (75 lines)
   - Pre-configured color schemes for 3 brands
   - Primary/accent/text color definitions
   - Font selections
   - Default caption style per brand

3. **demo_all_styles.py** (executable)
   - Generates PNG previews for each style
   - Creates comparison grid (2x4 composite)
   - Renders demo video (all styles, 2 sec each)
   - Supports --brand and --text arguments

## 8 Caption Styles

### 1. **Classic**
- **Use case:** Universal, professional, safe
- **Design:** Semi-transparent dark bar at bottom (60% opacity)
- **Text:** White, 48px, centered in bar
- **Best for:** All content types, maximum readability

### 2. **Bold Pop**
- **Use case:** Emphasis, attention-grabbing
- **Design:** Large text (72px) with black outline stroke
- **Text:** White with 3px black outline, no background
- **Best for:** Short impactful messages, titles

### 3. **Highlight**
- **Use case:** Teaching, word-by-word learning
- **Design:** Each word in colored rectangle background
- **Text:** White on brand primary color (80% opacity)
- **Best for:** Educational, karaoke-style content

### 4. **Minimal**
- **Use case:** Elegant, subtle, professional
- **Design:** White text with 2px drop shadow only
- **Text:** 44px, no background rectangle
- **Best for:** Subtitles, background information

### 5. **Karaoke**
- **Use case:** Word highlighting, active word emphasis
- **Design:** All words visible, one highlighted in accent color
- **Text:** White/accent on semi-transparent bar
- **Best for:** Karaoke, singing, language learning

### 6. **Lower Third**
- **Use case:** TV news style, speaker identification
- **Design:** Text bottom-left with accent bar above
- **Text:** Left-aligned with 4px accent bar + semi-transparent bg
- **Best for:** News, interviews, speaker credits

### 7. **Centered Title**
- **Use case:** Section headers, dramatic effect
- **Design:** Large text (56px) with full-width colored bar
- **Text:** White centered on brand primary color background
- **Best for:** Section breaks, title cards, transitions

### 8. **Subtitle**
- **Use case:** Cinema style, subtle info
- **Design:** Small text (32px) with minimal drop shadow
- **Text:** 50px from bottom, very subtle shadow
- **Best for:** Movie-style subtitles, footnotes

## Brand Kits

### TDHPS (The Dog House Pet Salon)
```python
{
    "primary_color": "#965B83",      # Pink
    "accent_color": "#CC3366",       # Hot pink
    "text_color": "#FFFFFF",         # White
    "default_caption_style": "classic"
}
```

### MPC (My Pet Credentials)
```python
{
    "primary_color": "#F5A623",      # Orange
    "accent_color": "#D4891C",       # Dark orange
    "text_color": "#FFFFFF",         # White
    "default_caption_style": "bold_pop"
}
```

### PawOps
```python
{
    "primary_color": "#D4A574",      # Tan/beige
    "accent_color": "#FFBB58",       # Gold
    "text_color": "#FFFFFF",         # White
    "default_caption_style": "lower_third"
}
```

## Usage Examples

### Basic Style Generation

```python
from scripts.caption_styles import style_classic
from scripts.brand_kits import get_brand_kit

# Get brand kit
tdhps = get_brand_kit("tdhps")

# Generate caption image
img = style_classic("Professional pet grooming", 1920, 1080, tdhps)

# Save as PNG
img.save("caption.png")

# Or convert to frame for video
import cv2
import numpy as np
frame_array = np.array(img.convert('RGB'))
```

### Using All Styles

```python
from scripts.caption_styles import STYLES

for style_name, style_func in STYLES.items():
    img = style_func("Your text here", 1920, 1080, brand)
    img.save(f"style_{style_name}.png")
```

### Custom Brand Kit

```python
from scripts.caption_styles import style_bold_pop

custom_brand = {
    "primary_color": "#FF5500",
    "accent_color": "#FFAA00",
    "text_color": "#FFFFFF",
    "bg_color": "#000000",
    "font_heading": "default",
    "font_body": "default",
}

img = style_bold_pop("Custom text", 1920, 1080, custom_brand)
```

## Demo Video Generation

Generate all 8 styles as preview images + video:

```bash
cd /home/aiciv/builds/purebrain-video-editor

# TDHPS brand (default text)
python3 scripts/demo_all_styles.py --brand tdhps

# MPC brand with custom text
python3 scripts/demo_all_styles.py --brand mpc --text "Pet credentials verified"

# PawOps brand, PNG only (no video)
python3 scripts/demo_all_styles.py --brand pawops --no-video
```

### Output Files

```
test-output/
├── style_preview_classic.png          (1920x1080)
├── style_preview_bold_pop.png
├── style_preview_highlight.png
├── style_preview_minimal.png
├── style_preview_karaoke.png
├── style_preview_lower_third.png
├── style_preview_centered_title.png
├── style_preview_subtitle.png
├── comparison_grid_tdhps.png          (1920x540, all 8 styles)
└── caption_styles_demo_tdhps.mp4      (16 sec video)
```

## Integration with FFmpeg

### Frame Composition Example

```python
import cv2
import numpy as np
from scripts.caption_styles import style_classic
from scripts.brand_kits import get_brand_kit

# Load video frame
frame = cv2.imread("frame.jpg")
height, width = frame.shape[:2]

# Generate caption
brand = get_brand_kit("tdhps")
caption = style_classic("Professional pet grooming", width, height, brand)

# Convert RGBA to BGRA for OpenCV
caption_np = np.array(caption)
caption_bgr = cv2.cvtColor(caption_np, cv2.COLOR_RGBA2BGRA)

# Composite caption onto frame
alpha = caption_np[:, :, 3] / 255.0
for i in range(3):
    frame[:, :, i] = frame[:, :, i] * (1 - alpha) + caption_bgr[:, :, i] * alpha

# Save result
cv2.imwrite("frame_with_caption.jpg", frame)
```

### FFmpeg Pipeline Integration

```bash
# Generate caption frames
python3 scripts/demo_all_styles.py --brand tdhps --no-video

# Composite captions onto video using ffmpeg
ffmpeg -i input_video.mp4 -i caption_frame.png \
  -filter_complex "overlay=0:0" \
  -c:v libx264 -c:a aac output.mp4
```

## Font Configuration

### Current Setup
- System fonts: DejaVu Sans, Liberation Sans (fallback chain)
- Custom fonts: `/home/aiciv/builds/purebrain-video-editor/assets/fonts/`

### Adding Custom Fonts

```bash
# Download from Google Fonts
mkdir -p /home/aiciv/builds/purebrain-video-editor/assets/fonts
cd assets/fonts
# Place .ttf files here
# Update caption_styles.py get_font() to reference them
```

### Updating Font References

Edit `caption_styles.py` get_font() function:
```python
font_paths = [
    os.path.join(FONTS_DIR, f"{name}.ttf"),
    # Add custom paths here
    "/path/to/custom/Font.ttf",
]
```

## Performance Characteristics

- **Image generation:** 50-100ms per caption (1920x1080)
- **Memory:** ~20MB per image (RGBA)
- **Video demo:** 43KB for 16-second 24fps video (all 8 styles)

## Customization Guide

### Modify Colors

Edit `brand_kits.py`:
```python
"tdhps": {
    "primary_color": "#YOURCOLOR",
    "accent_color": "#YOURCOLOR",
    ...
}
```

### Modify Style Layout

Edit `caption_styles.py` style function:
```python
def style_classic(text: str, width: int, height: int, brand: Optional[Dict] = None) -> Image.Image:
    # Change bar height
    bar_height = 120  # Modify here

    # Change opacity
    bar_color = (0, 0, 0, 153)  # Adjust alpha (4th value)
```

### Add New Style

```python
def style_custom(text: str, width: int, height: int, brand: Optional[Dict] = None) -> Image.Image:
    if brand is None:
        brand = DEFAULT_BRAND

    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Your custom drawing code

    return img

# Register in STYLES dictionary
STYLES["custom"] = style_custom
```

## Testing

### Verify All Styles Work
```bash
python3 scripts/demo_all_styles.py --brand tdhps
```

### Test Module Import
```python
from scripts.caption_styles import STYLES
from scripts.brand_kits import get_brand_kit

print(len(STYLES))  # Should be 8
print(len(get_brand_kit("tdhps")))  # Should have all keys
```

## Dependencies

- **Pillow** (PIL) - Image generation
- **FFmpeg** (optional) - Video encoding
- Python 3.7+

Install:
```bash
pip install Pillow
# ffmpeg via system package manager (apt, brew, etc.)
```

## Troubleshooting

### ImportError: No module named 'PIL'
```bash
pip install Pillow
```

### Font warnings
- Normal, uses fallback fonts (DejaVu Sans)
- To use custom fonts, place .ttf files in `assets/fonts/`

### Video encoding fails
- FFmpeg not installed: install with `apt install ffmpeg`
- PNG frames still created in `.frames_*` directory

## Architecture Notes

- **Separation of concerns:** caption_styles.py (rendering), brand_kits.py (configuration)
- **Function-based design:** Easy to test each style independently
- **RGBA output:** Enables layering on any background
- **No external dependencies:** PIL only (widely available)
- **Stateless:** Each function call is independent, no side effects

## Next Steps

1. **Integration:** Use with FFmpeg/cv2 to composite onto videos
2. **Animation:** Extend functions for fade-in/fade-out
3. **Font management:** Add custom font downloading/loading
4. **Real-time preview:** Build web UI showing style previews
5. **Performance:** Cache frequently used styles

## Files Generated by This System

**Location:** `/home/aiciv/builds/purebrain-video-editor/test-output/`

- 8 individual PNG previews per brand (1920x1080 each)
- 1 comparison grid per brand (1920x540, all 8 styles)
- 1 demo video per brand (MP4, 43KB, 16 seconds)

**For TDHPS, MPC, PawOps:** 24 PNG files + 3 MP4 videos
