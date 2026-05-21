#!/bin/bash
# Create TDHPS showcase video - step by step with FFmpeg

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

echo "=== Creating TDHPS Showcase Video ==="
echo "Output: $FINAL_OUTPUT"

# Check clips exist
echo ""
echo "Checking for raw clips..."
for clip in clip1.mov clip2.mov clip3.mov clip4.mov; do
  if [ -f "${CLIPS_DIR}/${clip}" ]; then
    size=$(du -h "${CLIPS_DIR}/${clip}" | cut -f1)
    echo "  ✓ ${clip} (${size})"
  else
    echo "  ✗ ${clip} NOT FOUND"
    exit 1
  fi
done

# Step 1: Scale and color grade each clip individually
echo ""
echo "Step 1: Scaling and color-grading clips..."

for i in 1 2 3 4; do
  input="${CLIPS_DIR}/clip${i}.mov"
  output="${OUTPUT_DIR}/clip${i}_scaled.mp4"

  echo "  Processing clip${i}..."
  ffmpeg -y -i "$input" \
    -vf "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:color=${DARK_BG},eq=brightness=0.04:contrast=1.12:saturation=1.2" \
    -c:v libx264 -preset veryfast -crf 20 \
    -c:a aac -b:a 128k \
    -r 30 \
    "$output" 2>&1 | grep -E "(frame=|error|Error)" | tail -1
done

# Step 2: Concatenate all clips using concat demux
echo ""
echo "Step 2: Concatenating clips..."

cat > "${OUTPUT_DIR}/concat.txt" << 'EOF'
file '/home/aiciv/builds/purebrain-video-editor/test-output/clip1_scaled.mp4'
file '/home/aiciv/builds/purebrain-video-editor/test-output/clip2_scaled.mp4'
file '/home/aiciv/builds/purebrain-video-editor/test-output/clip3_scaled.mp4'
file '/home/aiciv/builds/purebrain-video-editor/test-output/clip4_scaled.mp4'
EOF

ffmpeg -y \
  -f concat -safe 0 -i "${OUTPUT_DIR}/concat.txt" \
  -c copy \
  "${OUTPUT_DIR}/main_video.mp4" 2>&1 | grep -E "(frame=|error|Error|Duration)" | head -5

# Step 3: Create outro card with ImageMagick
echo ""
echo "Step 3: Creating branded outro card..."

convert -size 1080x1920 \
  "gradient:${BRAND_PINK}-${ACCENT_PINK}" \
  -font "Bowlby-One-SC" \
  -pointsize 64 \
  -fill "${WHITE}" \
  -gravity Center \
  -annotate +0-80 "The Dog House" \
  -pointsize 48 \
  -annotate +0+40 "Pet Salon" \
  -pointsize 24 \
  -annotate +0+150 "Book your pet's appointment today" \
  "${OUTPUT_DIR}/outro_card.png" 2>&1 | grep -E "Warning|Error" || echo "  ✓ Outro card created"

# Step 4: Create 3-second video from outro image
echo ""
echo "Step 4: Creating outro video..."

ffmpeg -y \
  -loop 1 \
  -i "${OUTPUT_DIR}/outro_card.png" \
  -c:v libx264 -preset veryfast -crf 20 \
  -t 3 -r 30 -pix_fmt yuv420p \
  "${OUTPUT_DIR}/outro_video.mp4" 2>&1 | grep -E "(frame=|error|Error)" | tail -1

# Step 5: Final concatenation with main video + outro
echo ""
echo "Step 5: Combining with outro..."

cat > "${OUTPUT_DIR}/final_concat.txt" << 'EOF'
file '/home/aiciv/builds/purebrain-video-editor/test-output/main_video.mp4'
file '/home/aiciv/builds/purebrain-video-editor/test-output/outro_video.mp4'
EOF

ffmpeg -y \
  -f concat -safe 0 -i "${OUTPUT_DIR}/final_concat.txt" \
  -c copy \
  "$FINAL_OUTPUT" 2>&1 | grep -E "(frame=|error|Error|Duration)" | head -5

# Step 6: Verify output
echo ""
echo "Step 6: Verifying output..."

if [ -f "$FINAL_OUTPUT" ]; then
  file_size_mb=$(du -h "$FINAL_OUTPUT" | cut -f1)
  echo "  ✓ Output file created: $FINAL_OUTPUT"
  echo "  ✓ File size: $file_size_mb"

  echo ""
  echo "Video information:"
  ffprobe -v error -show_format -show_streams "$FINAL_OUTPUT" 2>&1 | head -30

  echo ""
  echo "✓ Video creation successful!"
else
  echo "  ✗ Output file not found!"
  exit 1
fi
