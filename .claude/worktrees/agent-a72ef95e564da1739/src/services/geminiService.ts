import { GoogleGenAI } from "@google/genai";

// Vite 6 inlines VITE_* env vars at build time.
// This value is STATICALLY REPLACED — it IS present in the production JS bundle.
// Never store sensitive secrets here. Use a proxy endpoint for production.
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export function hasApiKey(): boolean {
  return !!API_KEY;
}

let genAI: GoogleGenAI | null = null;

function getGenAI() {
  if (!genAI && API_KEY) {
    genAI = new GoogleGenAI({ apiKey: API_KEY });
  }
  return genAI;
}

const FALLBACK_REPORT =
  "Environmental stability confirmed. Background monitoring active.";

export async function generateEnvironmentalReport(
  city: string,
  data: { temp: number; humidity: number; windSpeed: number; risk: string }
): Promise<string> {
  const ai = getGenAI();

  if (!ai) {
    return FALLBACK_REPORT;
  }

  try {
    const prompt = [
      `As a Sentinel AI Environmental Agent, provide a brief, professional, and slightly futuristic environmental analysis report for ${city}.`,
      `Current Metrics:`,
      `- Temperature: ${data.temp}°C`,
      `- Humidity: ${data.humidity}%`,
      `- Wind Speed: ${data.windSpeed} km/h`,
      `- Calculated Risk: ${data.risk}`,
      ``,
      `Format the response as a single, punchy paragraph (max 150 characters) that sounds like an AI status update. Use terms like "Telemetry", "Variance", "Node-calibrated", "Bio-signature".`,
    ].join("\n");

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    return response.text?.trim() || FALLBACK_REPORT;
  } catch (error) {
    console.error("Gemini Report Error:", error);
    return "Telemetry stream consistent with historical signatures. Local variance within nominal parameters.";
  }
}
