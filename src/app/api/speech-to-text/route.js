import { NextResponse } from "next/server";
import { transcribeAudio } from "./controller";

export async function POST(req) {
  try {
    console.log("Speech-to-text API called");

    // Get the form data
    const formData = await req.formData();
    const file = formData.get("file");
    const language = formData.get("language");

    console.log("File received:", file?.name, "Language:", language);

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    if (!language) {
      return NextResponse.json(
        { success: false, error: "No language provided" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    console.log("File size:", buffer.length, "bytes");

    if (buffer.length === 0) {
      return NextResponse.json(
        { success: false, error: "Empty file received" },
        { status: 400 }
      );
    }

    // Process the audio
    const result = await transcribeAudio(buffer, language, file.name);

    console.log("Transcription result:", result);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Speech-to-text API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Audio processing failed",
        details:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      },
      { status: 500 }
    );
  }
}
