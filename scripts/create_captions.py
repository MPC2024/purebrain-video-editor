#!/usr/bin/env python3
"""
TDHPS Video Caption Generator

Creates PNG overlays with TDHPS brand styling for video composition.
- Colors: Pink #965B83 (primary), Accent #CC3366
- Typography: Clean sans-serif, white text on semi-transparent dark bar
- Output: 464x848 PNGs (matching source video) with transparent background
"""

from PIL import Image, ImageDraw, ImageFont
import os

# TDHPS Brand Colors
PRIMARY_PINK = (150, 91, 131)  # #965B83
ACCENT_PINK = (204, 51, 102)   # #CC3366
WHITE = (255, 255, 255)
DARK_BG = (0, 0, 0, 180)        # Semi-transparent dark for text bar

# Output dimensions - matching source video (464x848)
WIDTH = 464
HEIGHT = 848
CAPTION_OUTPUT_DIR = "/home/aiciv/builds/purebrain-video-editor/test-output/captions"

# Captions: (text, font_size, duration_start, duration_end)
CAPTIONS = [
    ("Professional pet\ngrooming", 32, 0, 5),
    ("Real-time salon\nworkflow", 32, 5, 10),
    ("The Dog House\nPet Salon", 36, 10, 15),
    ("Book your\nappointment today", 28, 15, 17.2),
]


def create_caption_png(text, font_size, output_path):
    """
    Create a caption PNG with:
    - Transparent background
    - Semi-transparent dark bar at bottom
    - White centered text
    """
    # Create image with transparent background
    img = Image.new('RGBA', (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Use PIL's default FreeType font with size scaling
    try:
        font = ImageFont.load_default(size=font_size)
    except TypeError:
        # Older PIL versions don't support size parameter
        font = ImageFont.load_default()

    # Calculate text bounding box for centering
    # Use a dummy draw to get bbox
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]

    # Text position: centered horizontally, positioned near bottom
    text_x = (WIDTH - text_width) // 2
    text_y = HEIGHT - 180  # 180px from bottom

    # Draw semi-transparent dark background bar behind text
    bar_padding = 20
    bar_left = max(0, text_x - bar_padding)
    bar_top = max(0, text_y - bar_padding)
    bar_right = min(WIDTH, text_x + text_width + bar_padding)
    bar_bottom = min(HEIGHT, text_y + text_height + bar_padding)

    draw.rectangle(
        [(bar_left, bar_top), (bar_right, bar_bottom)],
        fill=DARK_BG
    )

    # Draw white text
    draw.text((text_x, text_y), text, font=font, fill=WHITE)

    # Save PNG
    img.save(output_path, 'PNG')
    print(f"Created: {output_path}")


def create_intro_card(output_path):
    """
    Create a 3-second intro card with gradient-like solid background
    and centered text.
    """
    img = Image.new('RGB', (WIDTH, HEIGHT), PRIMARY_PINK)
    draw = ImageDraw.Draw(img)

    try:
        title_font = ImageFont.load_default(size=40)
        subtitle_font = ImageFont.load_default(size=24)
    except TypeError:
        # Older PIL versions
        title_font = ImageFont.load_default()
        subtitle_font = ImageFont.load_default()

    # Title
    title_text = "The Dog House\nPet Salon"
    title_bbox = draw.textbbox((0, 0), title_text, font=title_font)
    title_width = title_bbox[2] - title_bbox[0]
    title_x = (WIDTH - title_width) // 2
    title_y = HEIGHT // 2 - 80
    draw.text((title_x, title_y), title_text, font=title_font, fill=WHITE)

    # Subtitle
    subtitle_text = "Professional Grooming"
    sub_bbox = draw.textbbox((0, 0), subtitle_text, font=subtitle_font)
    sub_width = sub_bbox[2] - sub_bbox[0]
    sub_x = (WIDTH - sub_width) // 2
    sub_y = title_y + 120
    draw.text((sub_x, sub_y), subtitle_text, font=subtitle_font, fill=WHITE)

    img.save(output_path, 'PNG')
    print(f"Created intro card: {output_path}")


def main():
    os.makedirs(CAPTION_OUTPUT_DIR, exist_ok=True)

    print(f"Generating TDHPS captions to {CAPTION_OUTPUT_DIR}/")
    print(f"Video dimensions: {WIDTH}x{HEIGHT}")
    print()

    # Generate caption overlays
    for i, (text, font_size, start_time, end_time) in enumerate(CAPTIONS, 1):
        output_path = os.path.join(CAPTION_OUTPUT_DIR, f"caption_{i:02d}.png")
        print(f"[{i}] {text.replace(chr(10), ' ')} ({start_time}s-{end_time}s)")
        create_caption_png(text, font_size, output_path)

    print()

    # Generate intro card
    intro_path = "/home/aiciv/builds/purebrain-video-editor/test-output/intro_card.png"
    create_intro_card(intro_path)

    print(f"\nAll captions generated successfully!")
    print(f"Caption directory: {CAPTION_OUTPUT_DIR}/")
    print(f"Intro card: {intro_path}")


if __name__ == "__main__":
    main()
