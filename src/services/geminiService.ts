import { GoogleGenAI } from "@google/genai";

let genAI: GoogleGenAI | null = null;

function getGenAI() {
  if (!genAI) {
    // Note: process.env.GEMINI_API_KEY is replaced by Vite's define at build time.
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined. Please check your environment variables.");
    }
    genAI = new GoogleGenAI({ apiKey });
  }
  return genAI;
}

export async function generateEnvironmentalReport(city: string, data: { temp: number, humidity: number, windSpeed: number, risk: string }) {
  try {
    const ai = getGenAI();
    const prompt = `
      As a Sentinel AI Environmental Agent, provide a brief, professional, and slightly futuristic environmental analysis report for ${city}.
      Current Metrics:
      - Temperature: ${data.temp}°C
      - Humidity: ${data.humidity}%
      - Wind Speed: ${data.windSpeed} km/h
      - Calculated Risk: ${data.risk}

      Format the response as a single, punchy paragraph (max 150 characters) that sounds like an AI status update. Use terms like "Telemetry", "Variance", "Node-calibrated", "Bio-signature".
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    return response.text?.trim() || "Environmental stability confirmed. Background monitoring active.";
  } catch (error) {
    console.error("Gemini Report Error:", error);
    return "Telemetry stream consistent with historical signatures. Local variance within nominal parameters.";
  }
}
