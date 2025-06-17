import { fileTypeFromBuffer } from "file-type";
import { exec } from "child_process";
import { stat } from "fs/promises";
import { existsSync, unlinkSync, writeFileSync, readFileSync } from "fs";
import util from "util";

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

// Fallback function for when FFmpeg is not available
const convertWithoutFFmpeg = (inputPath, outputPath) => {
  console.log("Converting without FFmpeg - copying file as WAV");

  // For deployment environments without FFmpeg, we'll try to use the file as-is
  // if it's already in a compatible format, or create a basic WAV header
  const inputBuffer = readFileSync(inputPath);

  // If it's already WAV, just copy it
  if (inputBuffer.subarray(0, 4).toString() === "RIFF") {
    writeFileSync(outputPath, inputBuffer);
    return outputPath;
  }

  // For other formats, we'll need to return an error since we can't convert without FFmpeg
  throw new Error(
    "Audio conversion required but FFmpeg not available. Please use WAV format or ensure FFmpeg is installed."
  );
};

export const convertToWav = async (inputPath) => {
  console.log("Converting audio to WAV:", inputPath);

  const outputPath = `${inputPath}.converted.wav`;

  // Check if ffmpeg is available
  let ffmpegAvailable = false;
  try {
    await execPromise("ffmpeg -version");
    ffmpegAvailable = true;
    console.log("FFmpeg is available");
  } catch (error) {
    console.log("FFmpeg not available, will try fallback method");
    ffmpegAvailable = false;
  }

  if (!ffmpegAvailable) {
    // Try fallback conversion
    try {
      convertWithoutFFmpeg(inputPath, outputPath);
    } catch (fallbackError) {
      console.error("Fallback conversion failed:", fallbackError.message);
      throw new Error(
        "Audio conversion failed: FFmpeg not available and fallback conversion failed. Please use WAV format."
      );
    }
  } else {
    // Use FFmpeg for conversion
    const cmd = [
      `ffmpeg -y -i "${inputPath}"`,
      `-ac 1 -ar 16000`,
      `-af "areverse,silenceremove=start_periods=1:start_duration=0.05:start_threshold=-60dB,` +
        `areverse,silenceremove=start_periods=1:start_duration=0.05:start_threshold=-60dB,` +
        `loudnorm=I=-16:TP=-1.5:LRA=11"`,
      `-f wav "${outputPath}"`,
    ].join(" ");

    console.log("Executing FFmpeg command:", cmd);

    try {
      const { stdout, stderr } = await execPromise(cmd);
      console.log("FFmpeg stdout:", stdout);
      if (stderr) console.log("FFmpeg stderr:", stderr);
    } catch (err) {
      console.error("FFmpeg conversion error:", err.message);
      if (existsSync(outputPath)) {
        try {
          unlinkSync(outputPath);
        } catch (unlinkErr) {
          console.warn(
            "Failed to cleanup failed conversion file:",
            unlinkErr.message
          );
        }
      }
      throw new Error(`Audio conversion failed: ${err.message}`);
    }
  }

  // Verify output file exists and has content
  if (!existsSync(outputPath)) {
    console.error("Conversion failed - output file not created");
    throw new Error("Audio conversion failed - output file not created");
  }

  const { size } = await stat(outputPath);
  console.log("Converted file size:", size, "bytes");

  if (size < 500) {
    console.error("Converted file too small:", size, "bytes");
    throw new Error(`Converted file too small: ${size} bytes`);
  }

  console.log("Audio conversion successful");
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
