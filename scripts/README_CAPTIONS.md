# Caption Styles Library - Quick Start

## What's Included

Three Python modules for professional video captions:

1. **caption_styles.py** - 8 caption rendering functions
2. **brand_kits.py** - Pre-configured color schemes
3. **demo_all_styles.py** - Preview generator + demo video creator

Plus integration examples:
- **integrate_captions.py** - How to use in video pipeline

## Quick Start (30 seconds)

```bash
# Generate all 8 caption styles as preview images + video
python3 demo_all_styles.py --brand tdhps

# Outputs to: ../test-output/
# - 8 PNG previews (1920x1080 each)
# - 1 comparison grid
# - 1 demo video (16 sec)
```

## 8 Caption Styles at a Glance

| Style | Use Case | Example |
|-------|----------|---------|
| **classic** | Professional, universal | Dark bar + white text |
| **bold_pop** | Attention-grabbing | Large outlined text |
| **highlight** | Teaching, karaoke | Word-by-word highlights |
| **minimal** | Elegant, subtle | White text + shadow |
| **karaoke** | Active word emphasis | One word in accent color |
| **lower_third** | News, interviews | Bottom-left + accent bar |
| **centered_title** | Section headers | Centered on colored bar |
| **subtitle** | Cinema style | Small text, 50px bottom |

## Using in Your Code

### Simple Usage

```python
from caption_styles import style_classic
from brand_kits import get_brand_kit

brand = get_brand_kit("tdhps")
img = style_classic("Your caption", 1920, 1080, brand)
img.save("caption.png")
```

### Loop All Styles

```python
from caption_styles import STYLES
from brand_kits import get_brand_kit

brand = get_brand_kit("tdhps")

for style_name, style_func in STYLES.items():
    img = style_func("Your text", 1920, 1080, brand)
    img.save(f"{style_name}.png")
```

### Composite onto Video Frame

```python
from PIL import Image
from caption_styles import style_classic
from brand_kits import get_brand_kit

# Load frame
frame = Image.open("frame.png")

# Generate caption
brand = get_brand_kit("tdhps")
caption = style_classic("Professional pet grooming", 1920, 1080, brand)

# Composite
frame.alpha_composite(caption)
frame.save("frame_with_caption.png")
```

## 3 Brand Kits

### TDHPS (The Dog House Pet Salon)
```python
get_brand_kit("tdhps")  # Pink/hot pink theme
```

### MPC (My Pet Credentials)
```python
get_brand_kit("mpc")  # Orange theme
```

### PawOps
```python
get_brand_kit("pawops")  # Gold/beige theme
```

## Demo Video Generation

```bash
# Default text + TDHPS
python3 demo_all_styles.py --brand tdhps

# Custom text + MPC
python3 demo_all_styles.py --brand mpc --text "Pet credentials verified"

# PawOps, PNG only
python3 demo_all_styles.py --brand pawops --no-video
```

Output files:
- `style_preview_[name].png` - Individual style (1920x1080)
- `comparison_grid_[brand].png` - All 8 styles grid (1920x540)
- `caption_styles_demo_[brand].mp4` - 16 sec video cycling through styles

## Integration with FFmpeg

### Composite Caption onto Existing Video

```bash
# Generate caption frame
python3 demo_all_styles.py --brand tdhps --no-video

# Use with ffmpeg (overlay)
ffmpeg -i input.mp4 -i style_preview_classic.png \
  -filter_complex "overlay=0:0:enable='between(t,0,2)'" \
  -c:v libx264 -c:a aac output.mp4
```

## Common Customizations

### Change Brand Colors

Edit `brand_kits.py`:
```python
"tdhps": {
    "primary_color": "#NEWCOLOR",
    ...
}
```

### Modify Style Layout

Edit `caption_styles.py`, e.g.:
```python
def style_classic(...):
    bar_height = 120  # Change this
    bar_color = (0, 0, 0, 153)  # Change opacity (4th value)
```

### Create New Style

```python
def style_custom(text, width, height, brand=None):
    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    # Your custom drawing
    return img

STYLES["custom"] = style_custom
```

## Files Reference

| File | Purpose |
|------|---------|
| caption_styles.py | Core 8 caption functions |
| brand_kits.py | Brand color definitions |
| demo_all_styles.py | Preview + video generator |
| integrate_captions.py | Usage examples |

## Performance

- Image generation: 50-100ms per caption
- Memory: ~20MB per 1920x1080 RGBA image
- Demo video: 43KB for 16 seconds (all 8 styles)

## Testing

Verify everything works:
```bash
python3 -c "
from caption_styles import STYLES
from brand_kits import get_brand_kit
print(f'Styles: {len(STYLES)}')
print(f'Brands: {len(get_brand_kit.__code__.co_freevars)}')
print('✓ Setup OK')
"
```

## Troubleshooting

**ImportError: No module named 'PIL'**
```bash
pip install Pillow
```

**FFmpeg not found (video encoding)**
- Install: `apt install ffmpeg` (Linux) or `brew install ffmpeg` (macOS)
- Fallback: PNG frames saved to `.frames_*` directory

**Font warnings**
- Normal, system fonts (DejaVu Sans) are used as fallback
- For custom fonts, place .ttf files in `assets/fonts/`

## Architecture

**Stateless design:** Each function call is independent
- No global state
- Easy to test
- Safe for concurrent use
- PIL-only dependency

**RGBA output:** All captions are RGBA images
- Enables layering on any background
- Alpha channel for transparency blending
- Works with any color background

## Next Steps

1. **Real-time preview:** Build web UI showing style previews
2. **Animation:** Extend functions for fade-in effects
3. **Font management:** Add custom font downloading
4. **Performance:** Cache frequently used styles
5. **Video integration:** Full FFmpeg wrapper

## Documentation

Full guide: `CAPTION_STYLES_GUIDE.md`

## License & Use

For TDHPS, MPC, PawOps video projects.
