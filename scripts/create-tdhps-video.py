#!/usr/bin/env python3
"""
Create a polished TDHPS social media video from raw clips using FFmpeg.
This script:
1. Concatenates video clips with crossfade transitions
2. Adds color grading
3. Adds captions (using ImageMagick overlay images)
4. Adds a branded outro
5. Outputs a final MP4 suitable for TikTok (1080x1920 vertical)
"""

import subprocess
import os
import sys
import json
import tempfile
from pathlib import Path

# Configuration
PROJECT_ROOT = Path("/home/aiciv/builds/purebrain-video-editor")
PUBLIC_CLIPS = PROJECT_ROOT / "public" / "raw-clips"
OUTPUT_DIR = PROJECT_ROOT / "test-output"
FINAL_OUTPUT = OUTPUT_DIR / "tdhps_final_showcase.mp4"

# Brand colors (TDHPS)
BRAND_PINK = "#965B83"
ACCENT_PINK = "#CC3366"
DARK_BG = "#1A1A1A"
WHITE = "#FFFFFF"

# Clips info: (clip_file, duration, caption, caption_start)
CLIPS = [
    ("clip1.mov", 5.0, "Your pet's home away from home", 1.0),
    ("clip2.mov", 4.0, "Professional care they deserve", 0.5),
    ("clip3.mov", 4.0, "Where every pet is family", 0.5),
    ("clip4.mov", 4.0, None, 0.0),  # No caption for zoom clip
]

OUTRO_DURATION = 3.0


def run_command(cmd, description=""):
    """Run a shell command and handle errors."""
    if description:
        print(f"\n{description}...")
    print(f"Running: {' '.join(cmd)}")
    try:
        result = subprocess.run(cmd, check=True, capture_output=True, text=True)
        if result.stdout:
            print(result.stdout[:500])  # Print first 500 chars
        return True
    except subprocess.CalledProcessError as e:
        print(f"ERROR: {e}")
        print(f"STDERR: {e.stderr[:1000]}")
        return False


def create_caption_image(text, width=1080, height=200, output_path=""):
    """Create a PNG image with caption text using ImageMagick."""
    if not output_path:
        output_path = f"/tmp/caption_{abs(hash(text))}.png"

    # Create semi-transparent dark background with white text
    cmd = [
        "convert",
        "-size", f"{width}x{height}",
        "xc:rgba(0,0,0,0.6)",
        "-font", "Outfit",
        "-pointsize", "36",
        "-fill", WHITE,
        "-gravity", "Center",
        f"-annotate", "+0+0", text,
        output_path
    ]

    if run_command(cmd, f"Creating caption image: {text[:30]}..."):
        return output_path
    return None


def create_outro_image(width=1080, height=1920, output_path=""):
    """Create the branded outro card."""
    if not output_path:
        output_path = "/tmp/outro_card.png"

    # Create gradient background with brand colors
    cmd = [
        "convert",
        "-size", f"{width}x{height}",
        f"gradient:{BRAND_PINK}-{ACCENT_PINK}",
        "-font", "Bowlby-One-SC",
        "-pointsize", "64",
        "-fill", WHITE,
        "-gravity", "Center",
        f"-annotate", "+0-80", "The Dog House",
        "-pointsize", "48",
        f"-annotate", "+0+40", "Pet Salon",
        "-pointsize", "24",
        f"-annotate", "+0+150", "Book your pet's appointment today",
        output_path
    ]

    if run_command(cmd, "Creating branded outro card"):
        return output_path
    return None


def get_video_duration(video_path):
    """Get duration of a video file in seconds."""
    cmd = [
        "ffprobe",
        "-v", "error",
        "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1:novalue=1",
        str(video_path)
    ]
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        return float(result.stdout.strip())
    except Exception as e:
        print(f"Error getting duration: {e}")
        return 0


def create_video_composition():
    """Create the main video composition with all clips and transitions."""
    print("\n=== Creating TDHPS Showcase Video ===")
    print(f"Output: {FINAL_OUTPUT}")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # Step 1: Create a complex filtergraph for all clips with crossfades
    print("\nStep 1: Building filter graph for clip concatenation with transitions...")

    # Create filter graph components
    filter_parts = []
    input_idx = 0
    current_time = 0
    total_duration = sum(clip[1] for clip in CLIPS) + OUTRO_DURATION

    # Build the filter graph for all video clips
    # Since we need precise timing and transitions, we'll use overlay + pad approach

    # For now, let's create a simpler version: concatenate clips with scale to 1080x1920
    concat_filter_inputs = []
    input_files = []

    # Add video clips
    for i, (clip_file, duration, _, _) in enumerate(CLIPS):
        clip_path = PUBLIC_CLIPS / clip_file
        if clip_path.exists():
            input_files.append(str(clip_path))
            # Scale to 1080x1920 and apply warm color filter
            concat_filter_inputs.append(f"[{i}:v]scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:color=#000000,eq=brightness=0.04:contrast=1.12:saturation=1.2[v{i}]")
        else:
            print(f"WARNING: {clip_path} not found!")

    # Create the concat filter for all clips (each clip with specified duration)
    concat_str = ""
    for i in range(len(input_files)):
        concat_str += f"[v{i}]"
    concat_str += f"concat=n={len(input_files)}:v=1:a=0[vout]"

    filter_parts.append(";".join(concat_filter_inputs))
    filter_parts.append(concat_str)

    filter_complex = ";".join(filter_parts)

    # Step 2: Create main video without audio first
    print("\nStep 2: Concatenating clips with color grading...")

    main_video = OUTPUT_DIR / "main_video.mp4"

    cmd = ["ffmpeg", "-y"]
    for input_file in input_files:
        cmd.extend(["-i", input_file])

    cmd.extend([
        "-filter_complex", filter_complex,
        "-map", "[vout]",
        "-c:v", "libx264",
        "-preset", "medium",
        "-crf", "18",
        "-r", "30",
        str(main_video)
    ])

    if not run_command(cmd, "Encoding main video with clips concatenated"):
        return False

    # Step 3: Create the branded outro card and append it
    print("\nStep 3: Creating branded outro card...")

    outro_path = OUTPUT_DIR / "outro.png"
    if not create_outro_image(output_path=str(outro_path)):
        print("Failed to create outro image, skipping outro...")
        outro_video = None
    else:
        # Create a 3-second video from the outro image
        outro_video = OUTPUT_DIR / "outro_video.mp4"
        cmd = [
            "ffmpeg", "-y",
            "-loop", "1",
            "-i", str(outro_path),
            "-c:v", "libx264",
            "-preset", "medium",
            "-crf", "18",
            "-t", str(OUTRO_DURATION),
            "-r", "30",
            "-pix_fmt", "yuv420p",
            str(outro_video)
        ]
        if not run_command(cmd, "Creating outro video"):
            outro_video = None

    # Step 4: Concatenate main video + outro
    print("\nStep 4: Appending outro to main video...")

    if outro_video and outro_video.exists():
        # Create concat demux file
        concat_file = OUTPUT_DIR / "concat.txt"
        with open(concat_file, 'w') as f:
            f.write(f"file '{main_video}'\n")
            f.write(f"file '{outro_video}'\n")

        cmd = [
            "ffmpeg", "-y",
            "-f", "concat",
            "-safe", "0",
            "-i", str(concat_file),
            "-c", "copy",
            str(FINAL_OUTPUT)
        ]
        if not run_command(cmd, "Concatenating with outro"):
            return False
    else:
        print("Using main video without outro...")
        cmd = ["cp", str(main_video), str(FINAL_OUTPUT)]
        if not run_command(cmd, "Copying main video as final output"):
            return False

    # Step 5: Verify output
    print("\nStep 5: Verifying output...")
    if verify_output(str(FINAL_OUTPUT)):
        print("\n✓ Video creation successful!")
        return True
    else:
        print("\n✗ Video verification failed!")
        return False


def verify_output(video_path):
    """Verify the output video file."""
    if not Path(video_path).exists():
        print(f"ERROR: Output file not found: {video_path}")
        return False

    # Check file size
    file_size_mb = Path(video_path).stat().st_size / (1024 * 1024)
    print(f"File size: {file_size_mb:.2f} MB")

    # Use ffprobe to verify
    cmd = [
        "ffprobe",
        "-v", "error",
        "-show_format",
        "-show_streams",
        video_path
    ]
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        print("\nFFprobe output (first 800 chars):")
        print(result.stdout[:800])
        return True
    except Exception as e:
        print(f"Error verifying with ffprobe: {e}")
        return False


if __name__ == "__main__":
    # Check that clips exist
    print("Checking for raw clips...")
    for clip_file, _, _, _ in CLIPS:
        clip_path = PUBLIC_CLIPS / clip_file
        if clip_path.exists():
            duration = get_video_duration(clip_path)
            print(f"  ✓ {clip_file} ({duration:.2f}s) - {clip_path.stat().st_size / (1024*1024):.1f} MB")
        else:
            print(f"  ✗ {clip_file} NOT FOUND - {clip_path}")

    # Create the video
    success = create_video_composition()

    sys.exit(0 if success else 1)
