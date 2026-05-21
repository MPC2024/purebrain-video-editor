#!/bin/bash
# Create TDHPS showcase video - with proper outro

set -e

PROJECT_ROOT="/home/aiciv/builds/purebrain-video-editor"
CLIPS_DIR="${PROJECT_ROOT}/public/raw-clips"
OUTPUT_DIR="${PROJECT_ROOT}/test-output"
FINAL_OUTPUT="${OUTPUT_DIR}/tdhps_final_showcase.mp4"

# Brand colors
BRAND_PINK="#965B83"
ACCENT_PINK="#CC3366"
DARK_BG="#1A1A1A"
WHITE="#FFFFFF"

mkdir -p "$OUTPUT_DIR"

echo "=== Creating TDHPS Showcase Video (Final) ==="
echo "Output: $FINAL_OUTPUT"

# Step 1: Use the pre-scaled clips that were already created
echo ""
echo "Step 1: Verifying scaled clips..."

CLIPS_READY=true
for i in 1 2 3 4; do
  scaled="${OUTPUT_DIR}/clip${i}_scaled.mp4"
  if [ -f "$scaled" ]; then
    size=$(du -h "$scaled" | cut -f1)
    echo "  ✓ clip${i}_scaled.mp4 ($size)"
  else
    echo "  ✗ clip${i}_scaled.mp4 NOT FOUND"
    CLIPS_READY=false
  fi
done

if [ "$CLIPS_READY" = false ]; then
  echo ""
  echo "Creating scaled clips first..."
  for i in 1 2 3 4; do
    input="${CLIPS_DIR}/clip${i}.mov"
    output="${OUTPUT_DIR}/clip${i}_scaled.mp4"

    echo "  Processing clip${i}..."
    /home/aiciv/.local/bin/ffmpeg -y -i "$input" \
      -vf "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:color=${DARK_BG},eq=brightness=0.04:contrast=1.12:saturation=1.2" \
      -c:v libx264 -preset veryfast -crf 20 \
      -c:a aac -b:a 128k \
      -r 30 \
      "$output" 2>&1 | tail -2
  done
fi

# Step 2: Concatenate all clips using concat demux
echo ""
echo "Step 2: Concatenating clips..."

cat > "${OUTPUT_DIR}/concat.txt" << 'EOF'
file '/home/aiciv/builds/purebrain-video-editor/test-output/clip1_scaled.mp4'
file '/home/aiciv/builds/purebrain-video-editor/test-output/clip2_scaled.mp4'
file '/home/aiciv/builds/purebrain-video-editor/test-output/clip3_scaled.mp4'
file '/home/aiciv/builds/purebrain-video-editor/test-output/clip4_scaled.mp4'
EOF

/home/aiciv/.local/bin/ffmpeg -y \
  -f concat -safe 0 -i "${OUTPUT_DIR}/concat.txt" \
  -c copy \
  "${OUTPUT_DIR}/main_video.mp4" 2>&1 | tail -2

# Step 3: Create outro using FFmpeg's color filter + drawtext-alternative
# Since drawtext may not be available, we'll create a solid color video with text overlay
echo ""
echo "Step 3: Creating branded outro video..."

# Create a pink gradient background as a video directly using ffmpeg
/home/aiciv/.local/bin/ffmpeg -y \
  -f lavfi \
  -i "color=c=${BRAND_PINK}:s=1080x1920:d=3:r=30" \
  -c:v libx264 -preset veryfast -crf 20 -pix_fmt yuv420p \
  "${OUTPUT_DIR}/outro_base.mp4" 2>&1 | tail -2

# Now overlay text using generated PNGs if convert is available
if command -v convert &> /dev/null; then
  echo "  Creating text overlays with ImageMagick..."

  # Create a transparent PNG with text
  convert -size 1080x600 \
    xc:transparent \
    -font "Bowlby-One-SC" \
    -pointsize 64 \
    -fill "${WHITE}" \
    -gravity Center \
    -annotate +0-60 "The Dog House" \
    -pointsize 48 \
    -annotate +0+40 "Pet Salon" \
    -pointsize 24 \
    -annotate +0+150 "Book your appointment today" \
    "${OUTPUT_DIR}/outro_text.png" 2>&1 | grep -E "Warning" || true

  # Composite the text over the gradient video
  /home/aiciv/.local/bin/ffmpeg -y \
    -i "${OUTPUT_DIR}/outro_base.mp4" \
    -i "${OUTPUT_DIR}/outro_text.png" \
    -filter_complex "[0:v][1:v]overlay=(W-w)/2:(H-h)/2[out]" \
    -map "[out]" \
    -c:v libx264 -preset veryfast -crf 20 -pix_fmt yuv420p \
    "${OUTPUT_DIR}/outro_video.mp4" 2>&1 | tail -2
else
  echo "  ImageMagick not available, using solid outro..."
  cp "${OUTPUT_DIR}/outro_base.mp4" "${OUTPUT_DIR}/outro_video.mp4"
fi

# Step 4: Final concatenation with main video + outro
echo ""
echo "Step 4: Combining with outro..."

cat > "${OUTPUT_DIR}/final_concat.txt" << 'EOF'
file '/home/aiciv/builds/purebrain-video-editor/test-output/main_video.mp4'
file '/home/aiciv/builds/purebrain-video-editor/test-output/outro_video.mp4'
EOF

/home/aiciv/.local/bin/ffmpeg -y \
  -f concat -safe 0 -i "${OUTPUT_DIR}/final_concat.txt" \
  -c copy \
  "$FINAL_OUTPUT" 2>&1 | tail -2

# Step 5: Verify output
echo ""
echo "Step 5: Verifying output..."

if [ -f "$FINAL_OUTPUT" ]; then
  file_size_mb=$(du -h "$FINAL_OUTPUT" | cut -f1)
  echo "  ✓ Output file created: $FINAL_OUTPUT"
  echo "  ✓ File size: $file_size_mb"

  echo ""
  echo "Video information:"
  /home/aiciv/.local/bin/ffprobe -v error -show_format -show_streams "$FINAL_OUTPUT" 2>&1 | grep -E "Duration|Stream|Video|Audio" || \
  /home/aiciv/.local/bin/ffmpeg -i "$FINAL_OUTPUT" 2>&1 | grep -E "Duration|Stream|Video|Audio" | head -10

  echo ""
  echo "✓ Video creation successful!"
  exit 0
else
  echo "  ✗ Output file not found!"
  exit 1
fi
