import { NextResponse } from "next/server";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

// Simple UUID v4 alternative
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// In-memory job tracking (in production, use Redis/DB)
const jobMap = new Map<
  string,
  {
    status: "pending" | "processing" | "complete" | "error";
    progress: number;
    downloadUrl?: string;
    errorMessage?: string;
    createdAt: number;
    duration?: number;
    fileSize?: number;
  }
>();

// Cleanup old jobs every 5 minutes (older than 1 hour)
setInterval(() => {
  const now = Date.now();
  for (const [id, job] of jobMap.entries()) {
    if (now - job.createdAt > 3600000) {
      jobMap.delete(id);
      try {
        const exportPath = path.join(
          "/tmp/purebrain-exports",
          `${id}_output.mp4`
        );
        if (fs.existsSync(exportPath)) {
          fs.unlinkSync(exportPath);
        }
      } catch (e) {
        console.error(`Error cleaning up ${id}:`, e);
      }
    }
  }
}, 300000); // 5 minutes

// Ensure export directory exists
const ensureExportDir = () => {
  const exportDir = "/tmp/purebrain-exports";
  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir, { recursive: true });
  }
  return exportDir;
};

// Quality to bitrate mapping
const qualitySettings = {
  low: { bitrate: "1500k", scale: 1280 },
  medium: { bitrate: "4000k", scale: 1920 },
  high: { bitrate: "8000k", scale: 3840 }
};

// Brand kit color schemes
const brandKits: Record<
  string,
  { primary: string; secondary: string; accent: string }
> = {
  tdhps: { primary: "#E94B8A", secondary: "#FFF", accent: "#000" },
  mpc: { primary: "#00A8FF", secondary: "#FFF", accent: "#000" },
  pawops: { primary: "#FF6B35", secondary: "#FFF", accent: "#000" },
  none: { primary: "#FFF", secondary: "#000", accent: "#666" }
};

export async function POST(request: Request) {
  const exportDir = ensureExportDir();

  try {
    const body = await request.json();
    const {
      videoData, // base64 or file content
      captionText,
      captionStyle = "classic",
      brandKit = "none",
      format = "youtube",
      quality = "medium",
      width = 1920,
      height = 1080,
      fps = 30
    } = body;

    // Validate inputs
    if (!videoData) {
      return NextResponse.json(
        { error: "videoData is required" },
        { status: 400 }
      );
    }

    const jobId = generateId();

    // Register job as pending
    jobMap.set(jobId, {
      status: "pending",
      progress: 0,
      createdAt: Date.now()
    });

    // Process asynchronously
    processExport(
      jobId,
      videoData,
      captionText,
      captionStyle,
      brandKit,
      format,
      quality,
      width,
      height,
      fps,
      exportDir
    ).catch((error) => {
      console.error(`Export ${jobId} failed:`, error);
      const job = jobMap.get(jobId);
      if (job) {
        job.status = "error";
        job.errorMessage = error.message || "Unknown error";
      }
    });

    return NextResponse.json(
      {
        success: true,
        jobId,
        status: "pending"
      },
      { status: 202 }
    );
  } catch (error) {
    console.error("Export request error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId");

    if (!jobId) {
      return NextResponse.json(
        { error: "jobId parameter is required" },
        { status: 400 }
      );
    }

    const job = jobMap.get(jobId);
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({
      jobId,
      status: job.status,
      progress: job.progress,
      downloadUrl: job.downloadUrl,
      errorMessage: job.errorMessage,
      duration: job.duration,
      fileSize: job.fileSize
    });
  } catch (error) {
    console.error("Status check error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

async function processExport(
  jobId: string,
  videoData: string,
  captionText: string | undefined,
  captionStyle: string,
  brandKit: string,
  format: string,
  quality: keyof typeof qualitySettings,
  width: number,
  height: number,
  fps: number,
  exportDir: string
) {
  const job = jobMap.get(jobId);
  if (!job) return;

  try {
    job.status = "processing";
    job.progress = 10;

    // Step 1: Write input video
    const inputPath = path.join(exportDir, `${jobId}_input.mp4`);
    const inputBuffer = Buffer.from(videoData, "base64");
    fs.writeFileSync(inputPath, inputBuffer);
    job.progress = 25;

    // Step 2: Create caption overlay if provided
    let captionPath: string | undefined;
    if (captionText && captionText.trim()) {
      captionPath = path.join(exportDir, `${jobId}_caption.png`);
      const brand = brandKits[brandKit] || brandKits.none;

      try {
        execSync(
          `python3 ${path.join(
            process.cwd(),
            "scripts/create_captions.py"
          )} --text "${captionText.replace(/"/g, '\\"')}" --style ${captionStyle} --brand ${brandKit} --width ${width} --height ${height} --output "${captionPath}"`,
          { stdio: "pipe", timeout: 30000 }
        );
      } catch (captionError) {
        console.warn(
          "Caption generation failed, continuing without captions:",
          captionError
        );
        captionPath = undefined;
      }
    }
    job.progress = 50;

    // Step 3: Apply color grading / format scaling
    const scaledPath = path.join(exportDir, `${jobId}_scaled.mp4`);
    const qualityConfig = qualitySettings[quality];

    const scaleFilter = `scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2`;

    execSync(
      `ffmpeg -i "${inputPath}" -vf "${scaleFilter}" -c:v libx264 -preset fast -b:v ${qualityConfig.bitrate} -c:a aac -b:a 128k -y "${scaledPath}"`,
      { stdio: "pipe", timeout: 120000 }
    );
    job.progress = 75;

    // Step 4: Overlay captions if they exist
    let outputPath = path.join(exportDir, `${jobId}_output.mp4`);
    if (captionPath && fs.existsSync(captionPath)) {
      const filter = `[0:v][1:v]overlay=0:0:enable='between(t,0,${getDurationFromFile(
        scaledPath
      )})'[outv]`;

      execSync(
        `ffmpeg -i "${scaledPath}" -i "${captionPath}" -filter_complex "${filter}" -map "[outv]" -map 0:a -c:v libx264 -preset fast -c:a aac -y "${outputPath}"`,
        { stdio: "pipe", timeout: 120000 }
      );
    } else {
      // Just copy if no captions
      execSync(`cp "${scaledPath}" "${outputPath}"`, { stdio: "pipe" });
    }
    job.progress = 90;

    // Step 5: Get file stats
    if (fs.existsSync(outputPath)) {
      const stats = fs.statSync(outputPath);
      job.fileSize = stats.size;
      job.duration = getDurationFromFile(outputPath);

      // Step 6: Move to public if needed, or serve from /tmp
      job.downloadUrl = `/api/export/download/${jobId}`;
      job.status = "complete";
      job.progress = 100;

      // Clean up intermediate files
      setTimeout(() => {
        try {
          if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
          if (fs.existsSync(scaledPath)) fs.unlinkSync(scaledPath);
          if (captionPath && fs.existsSync(captionPath))
            fs.unlinkSync(captionPath);
        } catch (e) {
          console.warn("Error cleaning intermediate files:", e);
        }
      }, 5000);
    } else {
      throw new Error("Output file was not created");
    }
  } catch (error) {
    job.status = "error";
    job.errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    job.progress = 0;
    console.error(`Export ${jobId} error:`, error);
  }
}

function getDurationFromFile(filePath: string): number {
  try {
    const output = execSync(
      `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1:noprint_wrappers=1 "${filePath}"`,
      { encoding: "utf-8" }
    );
    return Math.ceil(parseFloat(output.trim()));
  } catch (e) {
    console.warn("Could not get duration:", e);
    return 0;
  }
}
