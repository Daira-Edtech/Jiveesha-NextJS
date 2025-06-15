import { writeFileSync, readFileSync, unlinkSync, existsSync } from "fs";
import { stat } from "fs/promises";
import { fileTypeFromBuffer } from "file-type";
import { exec } from "child_process";
import util from "util";
import axios from "axios";
import path from "path";
import { hasAudioContent, convertToWav, validateAudioFile } from "./utils";

const execPromise = util.promisify(exec);

export const transcribeAudio = async (
  buffer,
  language,
  originalName = "input"
) => {
  const tempDir = "/tmp"; // for Vercel-compatible storage
  const origPath = path.join(tempDir, `${Date.now()}-${originalName}`);
  writeFileSync(origPath, buffer);

  let wavPath = null;
  try {
    const fileType = await validateAudioFile(buffer);
    wavPath = await convertToWav(origPath);

    const processed = readFileSync(wavPath);
    if (!hasAudioContent(processed)) {
      throw new Error("Audio contains no meaningful sound");
    }

    const audioBase64 = processed.toString("base64");
    const durationSec = processed.length / (16000 * 2);

    if (audioBase64.length < 100) {
      throw new Error("Base64 data too short");
    }

    const getServiceIdByLanguage = (lang) => {
      switch (lang) {
        case "ta":
          return process.env.SERVICE_ID_TAMIL;
        case "hi":
          return process.env.SERVICE_ID_HINDI;
        case "en":
          return process.env.SERVICE_ID_ENGLISH;
        default:
          throw new Error("Unsupported language");
      }
    };

    const payload = {
      pipelineTasks: [
        {
          taskType: "asr",
          config: {
            language: { sourceLanguage: language },
            serviceId: getServiceIdByLanguage(language),
            audioFormat: "wav",
            samplingRate: 16000,
          },
        },
      ],
      inputData: {
        audio: [{ audioContent: audioBase64 }],
      },
    };

    const response = await axios.post(process.env.ASR_API_URL, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.INFERENCE_API_KEY,
        userID: process.env.USER_ID,
        ulcaApiKey: process.env.ULCA_API_KEY,
      },
      timeout: 300000,
    });

    const transcript =
      response.data.pipelineResponse?.[0]?.output?.[0]?.source || "";

    if (!transcript) throw new Error("No transcription received");

    return {
      success: true,
      transcription: transcript
        .toLowerCase()
        .trim()
        .replace(/[.,!?;:]*$/, ""),
      audioDetails: {
        originalFormat: fileType.mime,
        duration: `${durationSec.toFixed(1)}s`,
        processedSize: processed.length,
      },
    };
  } finally {
    [origPath, wavPath].filter(Boolean).forEach((p) => {
      try {
        if (existsSync(p)) unlinkSync(p);
      } catch {}
    });
  }
};
