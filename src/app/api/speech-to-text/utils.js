import { fileTypeFromBuffer } from "file-type";
import { exec } from "child_process";
import { stat } from "fs/promises";
import {
  existsSync,
  unlinkSync,
  writeFileSync,
  readFileSync,
  mkdirSync,
} from "fs";
import util from "util";
import path from "path";
import os from "os";
import ffmpegPath from "ffmpeg-static";

const execPromise = util.promisify(exec);

export const validateAudioFile = async (buffer) => {
  console.log("Validating audio file, buffer size:", buffer.length);

  const type = await fileTypeFromBuffer(buffer);
  if (!type) {
    console.error("Unable to determine file type from buffer");
    throw new Error("Unable to determine file type");
  }

  console.log("Detected file type:", type.mime);

  const baseMime = type.mime.split(";")[0].trim();
  const supported = [
    "audio/wav",
    "audio/x-wav",
    "audio/webm",
    "video/webm",
    "audio/ogg",
    "application/ogg",
    "audio/opus",
    "audio/mp4",
    "audio/mpeg",
    "audio/mp3",
  ];

  if (!supported.includes(baseMime)) {
    console.error("Unsupported audio format:", type.mime);
    throw new Error(
      `Unsupported audio format: ${
        type.mime
      }. Supported formats: ${supported.join(", ")}`
    );
  }

  console.log("Audio file validation successful");
  return type;
};

export const convertToWav = async (inputPath) => {
  console.log("Converting audio to WAV:", inputPath);

  // Use temp directory for better compatibility with serverless environments
  const tempDir = os.tmpdir();
  const outputPath = path.join(tempDir, `${Date.now()}-converted.wav`);

  // Prefer system FFmpeg. If not available, fall back to the bundled static binary.
  const ffmpegExec = ffmpegPath || "ffmpeg";
  const cmd = [
    `"${ffmpegExec}" -y -i "${inputPath}"`,
    `-ac 1 -ar 16000`,
    `-af "areverse,silenceremove=start_periods=1:start_duration=0.05:start_threshold=-60dB,` +
      `areverse,silenceremove=start_periods=1:start_duration=0.05:start_threshold=-60dB,` +
      `loudnorm=I=-16:TP=-1.5:LRA=11"`,
    `-f wav "${outputPath}"`,
  ].join(" ");

  console.log("Executing FFmpeg command:", cmd);

  try {
    const execOptions =
      process.platform === "win32"
        ? { timeout: 30000, windowsHide: true }
        : { timeout: 30000 };

    const { stdout, stderr } = await execPromise(cmd, execOptions);

    console.log("FFmpeg stdout:", stdout);
    if (stderr) {
      console.log("FFmpeg stderr:", stderr);
    }

    // Check if output file exists and has content
    if (!existsSync(outputPath)) {
      throw new Error("FFmpeg conversion did not create output file.");
    }

    const stats = await stat(outputPath);
    if (stats.size < 500) {
      throw new Error("Converted file too small - likely conversion failed.");
    }

    console.log(
      "Conversion successful, output file:",
      outputPath,
      "size:",
      stats.size
    );
    return outputPath;
  } catch (error) {
    console.error("FFmpeg conversion failed:", error);

    // Clean up failed output file
    if (existsSync(outputPath)) {
      try {
        unlinkSync(outputPath);
      } catch (cleanupError) {
        console.warn(
          "Failed to cleanup failed conversion file:",
          cleanupError.message
        );
      }
    }

    throw new Error(`Audio conversion failed: ${error.message}`);
  }
};

export const hasAudioContent = (buffer) => {
  console.log("Checking audio content, buffer size:", buffer.length);

  if (buffer.length < 1000) {
    console.log("Buffer too small for meaningful audio");
    return false;
  }

  const header = 44; // WAV header size
  const sampleCount = Math.min(2000, buffer.length - header);

  try {
    for (let i = header; i < header + sampleCount; i += 2) {
      if (i + 1 < buffer.length) {
        const sample = Math.abs(buffer.readInt16LE(i));
        if (sample > 50) {
          console.log("Audio content check result: true");
          return true;
        }
      }
    }
  } catch (error) {
    console.warn("Error reading audio samples:", error.message);
    // If we can't read samples, assume there's content to avoid false negatives
    return true;
  }

  console.log("Audio content check result: false");
  return false;
};
