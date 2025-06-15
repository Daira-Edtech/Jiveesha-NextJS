import { NextResponse } from "next/server";
import { IncomingForm } from "formidable";
import fs from "fs";
import { transcribeAudio } from "./controller";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({ maxFileSize: 25 * 1024 * 1024 });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return resolve(
          NextResponse.json(
            { success: false, error: "File parsing failed" },
            { status: 400 }
          )
        );
      }

      try {
        const file = files.file;
        const fileBuffer = fs.readFileSync(file.filepath);
        const result = await transcribeAudio(
          fileBuffer,
          fields.language,
          file.originalFilename
        );

        resolve(NextResponse.json(result));
      } catch (error) {
        console.error("API Error:", error);
        resolve(
          NextResponse.json(
            {
              success: false,
              error: "Audio processing failed",
              details:
                process.env.NODE_ENV === "development"
                  ? error.message
                  : undefined,
            },
            { status: 500 }
          )
        );
      }
    });
  });
}
