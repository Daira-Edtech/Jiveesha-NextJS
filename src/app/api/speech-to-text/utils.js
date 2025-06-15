import { fileTypeFromBuffer } from "file-type";
import { exec } from "child_process";
import { stat } from "fs/promises";
import { existsSync, unlinkSync } from "fs";
import util from "util";

const execPromise = util.promisify(exec);

export const validateAudioFile = async (buffer) => {
  const type = await fileTypeFromBuffer(buffer);
  if (!type) throw new Error("Unable to determine file type");

  const baseMime = type.mime.split(";")[0].trim();
  const supported = [
    "audio/wav",
    "audio/x-wav",
    "audio/webm",
    "video/webm",
    "audio/ogg",
    "application/ogg",
    "audio/opus",
  ];

  if (!supported.includes(baseMime)) {
    throw new Error(`Unsupported audio format: ${type.mime}`);
  }

  return type;
};

export const convertToWav = async (inputPath) => {
  const outputPath = `${inputPath}.converted.wav`;
  const cmd = [
    `ffmpeg -y -i "${inputPath}"`,
    `-ac 1 -ar 16000`,
    `-af "areverse,silenceremove=start_periods=1:start_duration=0.05:start_threshold=-60dB,` +
      `areverse,silenceremove=start_periods=1:start_duration=0.05:start_threshold=-60dB,` +
      `loudnorm=I=-16:TP=-1.5:LRA=11"`,
    `-f wav "${outputPath}"`,
  ].join(" ");

  try {
    await execPromise(cmd);
    if (!existsSync(outputPath)) throw new Error("FFmpeg conversion failed");

    const { size } = await stat(outputPath);
    if (size < 500) throw new Error("Converted file too small");

    return outputPath;
  } catch (err) {
    if (existsSync(outputPath)) unlinkSync(outputPath);
    throw new Error(`Conversion error: ${err.message}`);
  }
};

export const hasAudioContent = (buffer) => {
  if (buffer.length < 1000) return false;
  const header = 44;
  for (let i = header; i < Math.min(header + 2000, buffer.length); i += 2) {
    if (Math.abs(buffer.readInt16LE(i)) > 50) return true;
  }
  return false;
};
