import { Router } from "express";
import { z } from "zod";
import { translateText, detectLanguage, getSupportedLanguages } from "../services/translation.js";

const router = Router();

// Validation schemas
const translateSchema = z.object({
  q: z.string().min(1, "Text to translate is required"),
  target: z.string().min(2, "Target language is required"),
  source: z.string().optional(),
  format: z.enum(["text", "html"]).optional().default("text")
});

const detectSchema = z.object({
  q: z.string().min(1, "Text to detect is required")
});

// Translation endpoint
router.post("/translate", async (req, res) => {
  try {
    const validatedData = translateSchema.parse(req.body);
    
    const result = await translateText({
      text: validatedData.q,
      target: validatedData.target,
      source: validatedData.source || "auto",
      format: validatedData.format
    });

    res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation error",
        details: error.errors
      });
    }
    
    console.error("Translation error:", error);
    res.status(500).json({
      error: "Translation failed",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// Language detection endpoint
router.post("/detect", async (req, res) => {
  try {
    const validatedData = detectSchema.parse(req.body);
    
    const result = await detectLanguage(validatedData.q);
    res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation error",
        details: error.errors
      });
    }
    
    console.error("Detection error:", error);
    res.status(500).json({
      error: "Language detection failed",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// Supported languages endpoint
router.get("/languages", async (_req, res) => {
  try {
    const languages = await getSupportedLanguages();
    res.json(languages);
  } catch (error) {
    console.error("Languages error:", error);
    res.status(500).json({
      error: "Failed to fetch supported languages",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

export { router as translateRouter };
