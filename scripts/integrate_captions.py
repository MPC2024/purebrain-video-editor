#!/usr/bin/env python3
"""
Example: Integrate caption styles into video rendering pipeline.

Shows how to:
1. Load a video frame
2. Generate caption with style
3. Composite onto frame
4. Output result

This is a template for FFmpeg/cv2 integration.
"""

import os
import sys
import argparse
from typing import Optional, Tuple

# Import our modules
sys.path.insert(0, os.path.dirname(__file__))
from caption_styles import STYLES
from brand_kits import get_brand_kit

try:
    from PIL import Image, ImageOps
    import numpy as np
except ImportError as e:
    print(f"Error: Missing required package: {e}")
    print("Install with: pip install Pillow numpy")
    sys.exit(1)

def composite_caption_onto_image(
    background_image: Image.Image,
    caption_text: str,
    style_name: str = "classic",
    brand_name: str = "tdhps",
    position: str = "overlay"  # "overlay" or "under"
) -> Image.Image:
    """
    Composite a caption onto an image.

    Args:
        background_image: PIL Image (RGB or RGBA)
        caption_text: Text for caption
        style_name: Which style to use (key in STYLES)
        brand_name: Which brand kit (tdhps, mpc, pawops)
        position: "overlay" (on top) or "under" (below)

    Returns:
        Composited image (RGBA)
    """
    if style_name not in STYLES:
        raise ValueError(f"Unknown style: {style_name}")

    # Ensure background is RGB
    if background_image.mode != 'RGB':
        background_image = background_image.convert('RGB')

    # Get dimensions
    width, height = background_image.size

    # Generate caption
    brand = get_brand_kit(brand_name)
    style_func = STYLES[style_name]
    caption_img = style_func(caption_text, width, height, brand)

    # Composite
    if position == "overlay":
        # Alpha blend: caption over background
        result = background_image.convert('RGBA')
        result.alpha_composite(caption_img)
        return result
    else:
        # Stack vertically: background above, caption below
        caption_height = int(height * 0.3)
        result_height = height + caption_height
        result = Image.new('RGBA', (width, result_height), (0, 0, 0, 255))

        # Paste background
        result.paste(background_image, (0, 0))

        # Paste caption below
        caption_resized = caption_img.resize((width, caption_height), Image.LANCZOS)
        result.paste(caption_resized, (0, height), caption_resized.split()[3])

        return result

def create_test_image(width: int = 1920, height: int = 1080) -> Image.Image:
    """Create a test image with gradient."""
    img = Image.new('RGB', (width, height))
    pixels = img.load()

    for y in range(height):
        for x in range(width):
            # Gradient from blue to purple
            r = int(50 + (x / width) * 50)
            g = int(100 - (y / height) * 50)
            b = int(200 - (x / width) * 50)
            pixels[x, y] = (r, g, b)

    return img

def composite_example():
    """Example: composite caption onto test image."""
    print("Creating example composited image...")

    # Create test image
    bg = create_test_image()

    # Composite caption
    result = composite_caption_onto_image(
        bg,
        caption_text="Professional pet grooming",
        style_name="classic",
        brand_name="tdhps",
        position="overlay"
    )

    # Save result
    output_dir = os.path.join(os.path.dirname(__file__), '..', 'test-output')
    os.makedirs(output_dir, exist_ok=True)

    output_path = os.path.join(output_dir, 'example_composite.png')
    result.convert('RGB').save(output_path, 'PNG')
    print(f"Saved: {output_path}")

def batch_caption_frames(
    input_dir: str,
    output_dir: str,
    caption_text: str,
    style_name: str = "classic",
    brand_name: str = "tdhps"
) -> int:
    """
    Add captions to all images in a directory.

    Args:
        input_dir: Directory with .png or .jpg files
        output_dir: Where to save captioned images
        caption_text: Caption to add
        style_name: Style to use
        brand_name: Brand kit

    Returns:
        Number of images processed
    """
    os.makedirs(output_dir, exist_ok=True)

    count = 0
    for filename in sorted(os.listdir(input_dir)):
        if not filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            continue

        input_path = os.path.join(input_dir, filename)
        output_path = os.path.join(output_dir, f"captioned_{filename}")

        try:
            img = Image.open(input_path)
            result = composite_caption_onto_image(
                img, caption_text, style_name, brand_name
            )
            result.convert('RGB').save(output_path, 'PNG')
            count += 1
            print(f"  {filename} -> captioned_{filename}")
        except Exception as e:
            print(f"  Error processing {filename}: {e}")

    return count

def main():
    parser = argparse.ArgumentParser(
        description="Integrate captions into video frames"
    )
    parser.add_argument(
        "--example",
        action="store_true",
        help="Run example composite"
    )
    parser.add_argument(
        "--batch",
        type=str,
        metavar="DIR",
        help="Batch process all images in directory"
    )
    parser.add_argument(
        "--text",
        default="Professional pet grooming",
        help="Caption text"
    )
    parser.add_argument(
        "--style",
        choices=list(STYLES.keys()),
        default="classic",
        help="Caption style"
    )
    parser.add_argument(
        "--brand",
        choices=["tdhps", "mpc", "pawops", "default"],
        default="tdhps",
        help="Brand kit"
    )
    parser.add_argument(
        "--output-dir",
        help="Output directory (for batch mode)"
    )

    args = parser.parse_args()

    if args.example:
        composite_example()
    elif args.batch:
        if not args.output_dir:
            args.output_dir = os.path.join(args.batch, 'captioned')
        count = batch_caption_frames(
            args.batch,
            args.output_dir,
            args.text,
            args.style,
            args.brand
        )
        print(f"Processed {count} images")
    else:
        composite_example()

if __name__ == "__main__":
    main()
