import {
  writeFileSync,
  readFileSync,
  unlinkSync,
  existsSync,
  mkdirSync,
} from "fs";
import { stat } from "fs/promises";
import { fileTypeFromBuffer } from "file-type";
import { exec } from "child_process";
import util from "util";
import axios from "axios";
import path from "path";
import os from "os";
import { hasAudioContent, convertToWav, validateAudioFile } from "./utils";

const execPromise = util.promisify(exec);

export const transcribeAudio = async (
  buffer,
  language,
  originalName = "input"
) => {
  console.log("Starting transcription for language:", language);

  // Use OS temp directory for better compatibility
  const tempDir = os.tmpdir();

  // Ensure temp directory exists
  if (!existsSync(tempDir)) {
    mkdirSync(tempDir, { recursive: true });
  }

  const timestamp = Date.now();
  const origPath = path.join(tempDir, `${timestamp}-${originalName}`);

  console.log("Temp file path:", origPath);

  // Validate environment variables
  const requiredEnvVars = [
    "ASR_API_URL",
    "INFERENCE_API_KEY",
    "USER_ID",
    "ULCA_API_KEY",
  ];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }

  writeFileSync(origPath, buffer);
  console.log("File written to temp directory");

  let wavPath = null;
  try {
    const fileType = await validateAudioFile(buffer);
    console.log("File type validated:", fileType.mime);

    wavPath = await convertToWav(origPath);
    console.log("Audio converted to WAV:", wavPath);

    const processed = readFileSync(wavPath);
    console.log("Processed audio size:", processed.length, "bytes");

    if (!hasAudioContent(processed)) {
      throw new Error("Audio contains no meaningful sound");
    }

    const audioBase64 = processed.toString("base64");
    const durationSec = processed.length / (16000 * 2);

    console.log(
      "Base64 length:",
      audioBase64.length,
      "Duration:",
      durationSec.toFixed(1) + "s"
    );

    if (audioBase64.length < 100) {
      throw new Error("Base64 data too short");
    }

    const getServiceIdByLanguage = (lang) => {
      console.log("Getting service ID for language:", lang);
      switch (lang) {
        case "ta":
          return process.env.SERVICE_ID_TAMIL;
        case "hi":
          return process.env.SERVICE_ID_HINDI;
        case "en":
          return process.env.SERVICE_ID_ENGLISH;
        case "kn":
          return process.env.SERVICE_ID_KANNADA;
        default:
          throw new Error(`Unsupported language: ${lang}`);
      }
    };

    const serviceId = getServiceIdByLanguage(language);
    if (!serviceId) {
      throw new Error(`Service ID not found for language: ${language}`);
    }

    console.log("Using service ID:", serviceId);

    const payload = {
      pipelineTasks: [
        {
          taskType: "asr",
          config: {
            language: { sourceLanguage: language },
            serviceId: serviceId,
            audioFormat: "wav",
            samplingRate: 16000,
          },
        },
      ],
      inputData: {
        audio: [{ audioContent: audioBase64 }],
      },
    };

    console.log("Sending request to ASR API...");

    const response = await axios.post(process.env.ASR_API_URL, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.INFERENCE_API_KEY,
        userID: process.env.USER_ID,
        ulcaApiKey: process.env.ULCA_API_KEY,
      },
      timeout: 30000, // Reduced timeout for Vercel
    });

    console.log("ASR API response status:", response.status);
    console.log(
      "ASR API response data:",
      JSON.stringify(response.data, null, 2)
    );

    const transcript =
      response.data.pipelineResponse?.[0]?.output?.[0]?.source || "";

    if (!transcript) {
      console.error("No transcription in response:", response.data);
      throw new Error("No transcription received from API");
    }

    console.log("Raw transcript:", transcript);

    const cleanedTranscript = transcript
      .toLowerCase()
      .trim()
      .replace(/[.,!?;:]*$/, "");

    console.log("Cleaned transcript:", cleanedTranscript);

    return {
      success: true,
      transcription: cleanedTranscript,
      audioDetails: {
        originalFormat: fileType.mime,
        duration: `${durationSec.toFixed(1)}s`,
        processedSize: processed.length,
      },
    };
  } catch (error) {
    console.error("Transcription error:", error);
    throw error;
  } finally {
    // Cleanup temp files
    [origPath, wavPath].filter(Boolean).forEach((p) => {
      try {
        if (existsSync(p)) {
          unlinkSync(p);
          console.log("Cleaned up temp file:", p);
        }
      } catch (cleanupError) {
        console.warn("Failed to cleanup temp file:", p, cleanupError.message);
      }
    });
  }
};
