#!/bin/bash
# TDHPS Video Composition with Caption Overlays

SOURCE_VIDEO="/home/aiciv/downloads/telegram_attachments/20260520_232217_IMG_5981.MOV"
CAPTION_DIR="/home/aiciv/builds/purebrain-video-editor/test-output/captions"
OUTPUT_DIR="/home/aiciv/builds/purebrain-video-editor/test-output"
OUTPUT_FILE="${OUTPUT_DIR}/tdhps_branded_with_captions.mp4"

FFMPEG="/home/aiciv/.local/bin/ffmpeg"

echo "TDHPS Video Composition with Caption Overlays"
echo "=============================================="
echo "Source video: $SOURCE_VIDEO"
echo "Output: $OUTPUT_FILE"
echo ""

# FFmpeg filter complex:
# 1. Input video (v=0)
# 2. Overlay caption_01.png from 0s to 5s
# 3. Overlay caption_02.png from 5s to 10s
# 4. Overlay caption_03.png from 10s to 15s
# 5. Overlay caption_04.png from 15s to 17.2s
# 6. Apply color grading (brightness, contrast, saturation)

$FFMPEG -i "$SOURCE_VIDEO" \
  -i "${CAPTION_DIR}/caption_01.png" \
  -i "${CAPTION_DIR}/caption_02.png" \
  -i "${CAPTION_DIR}/caption_03.png" \
  -i "${CAPTION_DIR}/caption_04.png" \
  -filter_complex "
    [0:v]scale=464:848,setsar=1[base];
    [base][1:v]overlay=0:0:enable='between(t,0,5)'[v1];
    [v1][2:v]overlay=0:0:enable='between(t,5,10)'[v2];
    [v2][3:v]overlay=0:0:enable='between(t,10,15)'[v3];
    [v3][4:v]overlay=0:0:enable='between(t,15,17.2)'[final]
  " \
  -map "[final]" \
  -map 0:a \
  -c:v libx264 \
  -crf 18 \
  -preset medium \
  -c:a aac \
  -y "$OUTPUT_FILE"

if [ $? -eq 0 ]; then
  echo ""
  echo "Encoding complete!"
  echo "Output file: $OUTPUT_FILE"
  ls -lh "$OUTPUT_FILE"
  echo ""
  echo "Video information:"
  $FFMPEG -i "$OUTPUT_FILE" 2>&1 | grep -E "Duration|Stream"
else
  echo "Error: FFmpeg encoding failed"
  exit 1
fi
