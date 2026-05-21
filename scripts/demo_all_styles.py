#!/usr/bin/env python3
"""
Demo all caption styles as PNG previews and video compilation.

Generates:
1. Individual PNG previews for each of 8 caption styles
2. A composite comparison grid showing all 8 styles
3. A demo video cycling through all styles (each 2 seconds)

Usage:
    python3 demo_all_styles.py [--brand tdhps|mpc|pawops] [--text "Custom text"]
"""

import os
import sys
import argparse
from pathlib import Path
from typing import Optional

# Import our modules
sys.path.insert(0, os.path.dirname(__file__))
from caption_styles import STYLES, DEFAULT_BRAND
from brand_kits import get_brand_kit, list_brands

try:
    from PIL import Image, ImageDraw
    import subprocess
except ImportError as e:
    print(f"Error: Missing required package: {e}")
    print("Install with: pip install Pillow")
    sys.exit(1)

# Constants
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'test-output')
DEFAULT_WIDTH = 1920
DEFAULT_HEIGHT = 1080
DEMO_TEXT = "Professional pet grooming"
VIDEO_FPS = 24
SECONDS_PER_STYLE = 2
FRAMES_PER_STYLE = VIDEO_FPS * SECONDS_PER_STYLE

def ensure_output_dir():
    """Create output directory if it doesn't exist."""
    os.makedirs(OUTPUT_DIR, exist_ok=True)

def generate_style_previews(text: str, brand_name: str):
    """Generate PNG preview for each caption style."""
    brand = get_brand_kit(brand_name)
    print(f"Generating style previews with brand: {brand['name']}")

    for style_name, style_func in STYLES.items():
        print(f"  - {style_name}...", end=" ")
        try:
            img = style_func(text, DEFAULT_WIDTH, DEFAULT_HEIGHT, brand)
            output_path = os.path.join(OUTPUT_DIR, f"style_preview_{style_name}.png")
            img.save(output_path, "PNG")
            print(f"OK ({output_path})")
        except Exception as e:
            print(f"ERROR: {e}")

def generate_comparison_grid(text: str, brand_name: str):
    """Generate composite image showing all 8 styles in a 2x4 grid."""
    brand = get_brand_kit(brand_name)
    print(f"Generating comparison grid...")

    # Grid layout: 2 rows x 4 columns
    thumb_width = 480
    thumb_height = 270
    grid_width = thumb_width * 4
    grid_height = thumb_height * 2 + 60  # +60 for labels

    grid = Image.new('RGB', (grid_width, grid_height), color=(30, 30, 30))
    draw = ImageDraw.Draw(grid)

    style_names = list(STYLES.keys())

    for idx, style_name in enumerate(style_names):
        row = idx // 4
        col = idx % 4

        try:
            # Generate style image
            style_func = STYLES[style_name]
            img = style_func(text, DEFAULT_WIDTH, DEFAULT_HEIGHT, brand)

            # Resize to thumbnail
            thumb = img.resize((thumb_width, thumb_height), Image.LANCZOS)

            # Paste into grid
            x = col * thumb_width
            y = row * thumb_height + 40

            # Convert RGBA to RGB for pasting
            if img.mode == 'RGBA':
                background = Image.new('RGB', thumb.size, (30, 30, 30))
                background.paste(thumb, mask=thumb.split()[3])
                grid.paste(background, (x, y))
            else:
                grid.paste(thumb, (x, y))

            # Draw label
            label_y = row * thumb_height + 5
            try:
                draw.text((x + 10, label_y), style_name, fill=(200, 200, 200))
            except Exception:
                pass  # If font drawing fails, skip label

        except Exception as e:
            print(f"  Error generating {style_name}: {e}")

    grid_path = os.path.join(OUTPUT_DIR, f"comparison_grid_{brand_name}.png")
    grid.save(grid_path, "PNG")
    print(f"  Saved: {grid_path}")

def generate_demo_video(text: str, brand_name: str):
    """Generate demo video cycling through all 8 styles (2 sec each)."""
    brand = get_brand_kit(brand_name)
    print(f"Generating demo video...")

    # Create temp directory for frames
    frames_dir = os.path.join(OUTPUT_DIR, f".frames_{brand_name}")
    os.makedirs(frames_dir, exist_ok=True)

    frame_count = 0
    style_names = list(STYLES.keys())

    # Generate frames for each style
    for style_name in style_names:
        print(f"  Rendering style '{style_name}'...", end=" ", flush=True)

        try:
            style_func = STYLES[style_name]
            img = style_func(text, DEFAULT_WIDTH, DEFAULT_HEIGHT, brand)

            # Convert RGBA to RGB for video encoding
            if img.mode == 'RGBA':
                bg = Image.new('RGB', img.size, (0, 0, 0))
                bg.paste(img, mask=img.split()[3])
                img = bg

            # Save frame repeated for duration
            for frame_num in range(FRAMES_PER_STYLE):
                frame_path = os.path.join(frames_dir, f"frame_{frame_count:06d}.png")
                img.save(frame_path, "PNG")
                frame_count += 1

            print(f"OK ({FRAMES_PER_STYLE} frames)")
        except Exception as e:
            print(f"ERROR: {e}")

    # Use ffmpeg to create video from frames
    video_path = os.path.join(OUTPUT_DIR, f"caption_styles_demo_{brand_name}.mp4")
    frame_pattern = os.path.join(frames_dir, "frame_%06d.png")

    ffmpeg_cmd = [
        "ffmpeg",
        "-framerate", str(VIDEO_FPS),
        "-i", frame_pattern,
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-crf", "23",  # Quality (lower = better, 0-51)
        "-y",  # Overwrite output file
        video_path
    ]

    print(f"  Encoding video with ffmpeg...")
    try:
        result = subprocess.run(ffmpeg_cmd, capture_output=True, text=True)
        if result.returncode == 0:
            print(f"  Video saved: {video_path}")
        else:
            print(f"  ffmpeg error: {result.stderr}")
            print(f"  (ffmpeg may not be installed, PNG frames saved to {frames_dir})")
    except FileNotFoundError:
        print(f"  ffmpeg not found, skipping video generation")
        print(f"  PNG frames saved to: {frames_dir}")

    # Clean up frames (optional)
    # shutil.rmtree(frames_dir)

    return video_path

def main():
    parser = argparse.ArgumentParser(
        description="Generate caption style previews and demo video"
    )
    parser.add_argument(
        "--brand",
        choices=list_brands(),
        default="tdhps",
        help=f"Brand kit to use (default: tdhps)"
    )
    parser.add_argument(
        "--text",
        default=DEMO_TEXT,
        help=f"Caption text to use (default: '{DEMO_TEXT}')"
    )
    parser.add_argument(
        "--no-video",
        action="store_true",
        help="Skip video generation (only create PNG previews)"
    )

    args = parser.parse_args()

    ensure_output_dir()

    print("=" * 70)
    print("PureBrain Video Editor - Caption Styles Demo Generator")
    print("=" * 70)
    print()

    # Generate all outputs
    generate_style_previews(args.text, args.brand)
    print()

    generate_comparison_grid(args.text, args.brand)
    print()

    if not args.no_video:
        generate_demo_video(args.text, args.brand)
    else:
        print("Skipping video generation (--no-video)")

    print()
    print("=" * 70)
    print(f"Output files saved to: {OUTPUT_DIR}")
    print("=" * 70)

if __name__ == "__main__":
    main()
