"""
Caption Styles Module for PureBrain Video Editor

8 caption style functions for PIL+FFmpeg rendering pipeline.
Each function takes (text, width, height, brand_kit) and returns RGBA PIL Image.
"""

from PIL import Image, ImageDraw, ImageFont
import os
from typing import Dict, Tuple, Optional

FONTS_DIR = os.path.join(os.path.dirname(__file__), '..', 'assets', 'fonts')

def get_font(name: str = "default", size: int = 48) -> ImageFont.FreeTypeFont:
    """
    Try to load a font, fall back to default.
    Attempts: custom fonts, system fonts, PIL default.
    """
    font_paths = [
        os.path.join(FONTS_DIR, f"{name}.ttf"),
        os.path.join(FONTS_DIR, f"{name}", "Regular.ttf"),
        f"/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        f"/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        f"/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
    ]

    for path in font_paths:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except Exception:
                continue

    # Fallback: default PIL font
    return ImageFont.load_default()

# Default Brand Kit
DEFAULT_BRAND = {
    "name": "Default",
    "primary_color": "#965B83",      # TDHPS pink
    "accent_color": "#CC3366",        # Hot pink
    "text_color": "#FFFFFF",          # White
    "bg_color": "#000000",            # Black
    "font_heading": "default",
    "font_body": "default",
}

def hex_to_rgba(hex_color: str, alpha: int = 255) -> Tuple[int, int, int, int]:
    """Convert hex color string to RGBA tuple."""
    hex_color = hex_color.lstrip('#')
    if len(hex_color) == 6:
        r = int(hex_color[0:2], 16)
        g = int(hex_color[2:4], 16)
        b = int(hex_color[4:6], 16)
        return (r, g, b, alpha)
    return (255, 255, 255, alpha)

def draw_text_with_outline(draw: ImageDraw.ImageDraw, position: Tuple[int, int],
                          text: str, font: ImageFont.FreeTypeFont,
                          text_color: Tuple[int, int, int, int],
                          outline_color: Tuple[int, int, int, int] = (0, 0, 0, 255),
                          outline_width: int = 2) -> None:
    """Draw text with outline/stroke effect."""
    x, y = position

    # Draw outline (4 directions)
    for adj_x in range(-outline_width, outline_width + 1):
        for adj_y in range(-outline_width, outline_width + 1):
            if adj_x != 0 or adj_y != 0:
                draw.text((x + adj_x, y + adj_y), text, font=font, fill=outline_color)

    # Draw main text on top
    draw.text(position, text, font=font, fill=text_color)

def get_text_bbox(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.FreeTypeFont) -> Tuple[int, int, int, int]:
    """Get bounding box for text."""
    try:
        # PIL 8.0+
        bbox = draw.textbbox((0, 0), text, font=font)
        return bbox
    except Exception:
        # Fallback for older PIL
        return (0, 0, 100, 30)

def style_classic(text: str, width: int, height: int, brand: Optional[Dict] = None) -> Image.Image:
    """
    White text on semi-transparent dark bar at bottom.
    Classic caption style: safe, readable, professional.
    """
    if brand is None:
        brand = DEFAULT_BRAND

    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Semi-transparent dark bar at bottom (height ~120px)
    bar_height = 120
    bar_rect = [(0, height - bar_height), (width, height)]
    bar_color = (0, 0, 0, 153)  # 60% opacity
    draw.rectangle(bar_rect, fill=bar_color)

    # Text
    font = get_font(brand["font_body"], 48)
    text_color = hex_to_rgba(brand["text_color"])

    # Center text horizontally, position in bar
    bbox = get_text_bbox(draw, text, font)
    text_width = bbox[2] - bbox[0]
    text_x = (width - text_width) // 2
    text_y = height - bar_height + (bar_height - (bbox[3] - bbox[1])) // 2

    draw.text((text_x, text_y), text, font=font, fill=text_color)

    return img

def style_bold_pop(text: str, width: int, height: int, brand: Optional[Dict] = None) -> Image.Image:
    """
    Large bold text with black outline stroke, no background.
    Eye-catching, dynamic, best for short text.
    """
    if brand is None:
        brand = DEFAULT_BRAND

    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Large bold font
    font = get_font(brand["font_heading"], 72)
    text_color = hex_to_rgba(brand["text_color"])

    # Get text size for centering
    bbox = get_text_bbox(draw, text, font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]

    text_x = (width - text_width) // 2
    text_y = (height - text_height) // 2 + 80  # Slightly lower than center

    # Draw with outline
    draw_text_with_outline(draw, (text_x, text_y), text, font, text_color,
                          outline_color=(0, 0, 0, 255), outline_width=3)

    return img

def style_highlight(text: str, width: int, height: int, brand: Optional[Dict] = None) -> Image.Image:
    """
    Text with highlighted/colored background behind each word.
    Great for emphasis, teaches words one by one.
    """
    if brand is None:
        brand = DEFAULT_BRAND

    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    font = get_font(brand["font_body"], 56)
    text_color = hex_to_rgba(brand["text_color"])
    highlight_color = hex_to_rgba(brand["primary_color"], 204)  # 80% opacity

    words = text.split()

    # Calculate total width needed
    total_width = 0
    word_bboxes = []
    for word in words:
        bbox = get_text_bbox(draw, word, font)
        word_width = bbox[2] - bbox[0] + 20  # padding
        word_bboxes.append(word_width)
        total_width += word_width + 10  # gap between words

    # Start position (centered)
    start_x = max(40, (width - total_width) // 2)
    start_y = (height - 100) // 2

    current_x = start_x
    for word, word_width in zip(words, word_bboxes):
        # Draw background rectangle
        bbox = get_text_bbox(draw, word, font)
        word_h = bbox[3] - bbox[1]
        rect = [(current_x - 10, start_y - 10),
                (current_x + word_width - 10, start_y + word_h + 10)]
        draw.rectangle(rect, fill=highlight_color)

        # Draw text
        draw.text((current_x, start_y), word, font=font, fill=text_color)

        current_x += word_width + 10

    return img

def style_minimal(text: str, width: int, height: int, brand: Optional[Dict] = None) -> Image.Image:
    """
    Clean white text with subtle drop shadow only.
    Elegant, minimal, professional, great for subtitles.
    """
    if brand is None:
        brand = DEFAULT_BRAND

    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    font = get_font(brand["font_body"], 44)
    text_color = hex_to_rgba(brand["text_color"])
    shadow_color = (0, 0, 0, 100)  # Black shadow, 40% opacity

    # Get text size
    bbox = get_text_bbox(draw, text, font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]

    text_x = (width - text_width) // 2
    text_y = height - 120  # Lower portion

    # Draw shadow first (2px offset)
    draw.text((text_x + 2, text_y + 2), text, font=font, fill=shadow_color)

    # Draw main text
    draw.text((text_x, text_y), text, font=font, fill=text_color)

    return img

def style_karaoke(text: str, width: int, height: int, brand: Optional[Dict] = None,
                  active_word: int = 0) -> Image.Image:
    """
    Words displayed with active word highlighted in brand color.
    Others in white. Used for karaoke-style effects (one word highlighted at a time).
    """
    if brand is None:
        brand = DEFAULT_BRAND

    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    font = get_font(brand["font_body"], 52)
    text_color = hex_to_rgba(brand["text_color"])
    active_color = hex_to_rgba(brand["accent_color"])

    # Semi-transparent bar background
    bar_height = 100
    bar_color = (0, 0, 0, 128)  # 50% opacity
    draw.rectangle([(0, height - bar_height), (width, height)], fill=bar_color)

    words = text.split()

    # Layout words
    total_width = 0
    word_bboxes = []
    for word in words:
        bbox = get_text_bbox(draw, word, font)
        word_width = bbox[2] - bbox[0] + 16  # padding
        word_bboxes.append(word_width)
        total_width += word_width + 12

    start_x = (width - total_width) // 2
    start_y = height - bar_height + 20

    current_x = start_x
    for i, (word, word_width) in enumerate(zip(words, word_bboxes)):
        color = active_color if i == active_word else text_color
        draw.text((current_x, start_y), word, font=font, fill=color)
        current_x += word_width + 12

    return img

def style_lower_third(text: str, width: int, height: int, brand: Optional[Dict] = None) -> Image.Image:
    """
    Text anchored bottom-left with accent color bar above.
    TV news style, professional, great for speaker names/titles.
    """
    if brand is None:
        brand = DEFAULT_BRAND

    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    font = get_font(brand["font_body"], 48)
    text_color = hex_to_rgba(brand["text_color"])
    accent_color = hex_to_rgba(brand["accent_color"])

    # Text position: lower left
    text_x = 40
    text_y = height - 80

    # Draw accent bar above text (4px tall)
    bar_width = 120
    bar_y = text_y - 20
    draw.rectangle([(text_x, bar_y - 4), (text_x + bar_width, bar_y)], fill=accent_color)

    # Draw semi-transparent background behind text
    bbox = get_text_bbox(draw, text, font)
    bg_rect = [(text_x - 10, text_y - 10),
               (text_x + (bbox[2] - bbox[0]) + 10, text_y + (bbox[3] - bbox[1]) + 10)]
    draw.rectangle(bg_rect, fill=(0, 0, 0, 128))  # 50% black

    # Draw text
    draw.text((text_x, text_y), text, font=font, fill=text_color)

    return img

def style_centered_title(text: str, width: int, height: int, brand: Optional[Dict] = None) -> Image.Image:
    """
    Large centered text with gradient-like background strip.
    Perfect for section titles, movie-style intro text.
    """
    if brand is None:
        brand = DEFAULT_BRAND

    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    font = get_font(brand["font_heading"], 56)
    text_color = hex_to_rgba(brand["text_color"])
    primary_color = hex_to_rgba(brand["primary_color"], 200)

    # Get text size
    bbox = get_text_bbox(draw, text, font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]

    text_x = (width - text_width) // 2
    text_y = height // 2 - text_height // 2 + 60

    # Draw full-width gradient-like bar (solid primary color)
    bar_height = text_height + 40
    bar_y = text_y - 20
    draw.rectangle([(0, bar_y), (width, bar_y + bar_height)], fill=primary_color)

    # Draw text on top
    draw.text((text_x, text_y), text, font=font, fill=text_color)

    return img

def style_subtitle(text: str, width: int, height: int, brand: Optional[Dict] = None) -> Image.Image:
    """
    Small cinema-style subtitle at very bottom.
    Subtle, elegant, non-intrusive for background info.
    """
    if brand is None:
        brand = DEFAULT_BRAND

    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    font = get_font(brand["font_body"], 32)
    text_color = hex_to_rgba(brand["text_color"])
    shadow_color = (0, 0, 0, 80)  # Very subtle shadow

    # Get text size
    bbox = get_text_bbox(draw, text, font)
    text_width = bbox[2] - bbox[0]

    text_x = (width - text_width) // 2
    text_y = height - 50  # 50px from bottom

    # Draw subtle shadow
    draw.text((text_x + 1, text_y + 1), text, font=font, fill=shadow_color)

    # Draw main text
    draw.text((text_x, text_y), text, font=font, fill=text_color)

    return img

# Style registry
STYLES = {
    "classic": style_classic,
    "bold_pop": style_bold_pop,
    "highlight": style_highlight,
    "minimal": style_minimal,
    "karaoke": style_karaoke,
    "lower_third": style_lower_third,
    "centered_title": style_centered_title,
    "subtitle": style_subtitle,
}
