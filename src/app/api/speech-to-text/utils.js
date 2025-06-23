import { fileTypeFromBuffer } from "file-type";
import { exec } from "child_process";
import { stat } from "fs/promises";
import {
  existsSync,
  unlinkSync,
  writeFileSync,
  readFileSync,
  chmodSync,
} from "fs";
import util from "util";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const ffmpeg = require("ffmpeg-static");

// In some environments (like Render), the ffmpeg binary might not have execute permissions by default.
try {
  if (process.platform !== "win32") {
    // No need to chmod on Windows
    chmodSync(ffmpeg, "755");
  }
} catch (e) {
  console.warn("Could not set executable permissions for ffmpeg:", e);
}

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

  const outputPath = `${inputPath}.converted.wav`;
  const ffmpegPath = ffmpeg;

  const cmd = [
    `"${ffmpegPath}" -y -i "${inputPath}"`,
    `-ac 1 -ar 16000`,
    `-af "areverse,silenceremove=start_periods=1:start_duration=0.05:start_threshold=-60dB,` +
      `areverse,silenceremove=start_periods=1:start_duration=0.05:start_threshold=-60dB,` +
      `loudnorm=I=-16:TP=-1.5:LRA=11"`,
    `-c:a pcm_s16le`,
    `"${outputPath}"`,
  ].join(" ");

  console.log("Executing FFmpeg command:", cmd);

  try {
    const { stdout, stderr } = await execPromise(cmd);
    console.log("FFmpeg stdout:", stdout);
    if (stderr) {
      console.log("FFmpeg stderr:", stderr);
    }

    const stats = await stat(outputPath);
    if (stats.size === 0) {
      throw new Error("FFmpeg conversion resulted in an empty file.");
    }
    console.log("Conversion successful, output file:", outputPath);
  } catch (error) {
    console.error("FFmpeg conversion failed:", error);
    throw new Error(`Audio conversion failed: ${error.message}`);
  }

  return outputPath;
};

export const hasAudioContent = (buffer) => {
  console.log("Checking audio content, buffer size:", buffer.length);

  if (buffer.length < 1000) {
    console.log("Buffer too small for meaningful audio");
    return false;
  }

  const header = 44; // WAV header size
  const sampleCount = Math.min(2000, buffer.length - header);
  let hasContent = false;

  try {
    for (let i = header; i < header + sampleCount; i += 2) {
      if (i + 1 < buffer.length) {
        const sample = Math.abs(buffer.readInt16LE(i));
        if (sample > 50) {
          hasContent = true;
          break;
        }
      }
    }
  } catch (error) {
    console.warn("Error reading audio samples:", error.message);
    // If we can't read samples, assume there's content to avoid false negatives
    return true;
  }

  console.log("Audio content check result:", hasContent);
  return hasContent;
};
