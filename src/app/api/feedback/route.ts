import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

export async function POST(req: Request) {
  try {
    const { feedback } = await req.json();

    // Analyze the feedback using AI
    const analysis = await analyzeFeedback(feedback);

    // In a real application, you would store this in a database
    // and trigger notifications based on priority

    return Response.json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error("Error processing feedback:", error);
    return Response.json(
      {
        success: false,
        error: "Failed to process feedback",
      },
      { status: 500 }
    );
  }
}

async function analyzeFeedback(feedback: any) {
  const { text, rating } = feedback;

  // Use AI to analyze the sentiment and extract key issues
  const prompt = `
    Analyze the following hotel/restaurant guest feedback:
    
    Rating: ${rating}/5
    Feedback: "${text}"
    
    Provide a JSON response with the following structure:
    {
      "sentiment": "positive" | "negative" | "neutral",
      "priority": "high" | "medium" | "low",
      "category": "The main category of the feedback (e.g., Service, Food, Cleanliness)",
      "keyIssues": ["List of specific issues mentioned"],
      "recommendedAction": "What action should staff take"
    }
  `;

  const { text: analysisText } = await generateText({
    model: openai("gpt-4o"),
    prompt,
  });

  // Parse the JSON response
  try {
    return JSON.parse(analysisText);
  } catch (error) {
    console.error("Error parsing AI response:", error);
    return {
      sentiment:
        rating >= 4 ? "positive" : rating <= 2 ? "negative" : "neutral",
      priority: rating <= 2 ? "high" : "medium",
      category: "General",
      keyIssues: ["Unable to automatically categorize"],
      recommendedAction: "Review manually",
    };
  }
}
