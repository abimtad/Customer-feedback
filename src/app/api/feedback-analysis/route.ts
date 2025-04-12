import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

export async function POST(req: Request) {
  try {
    const { feedback, mediaType } = await req.json();

    // Analyze the feedback using AI
    const analysis = await analyzeFeedback(feedback, mediaType);

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

async function analyzeFeedback(feedback: any, mediaType?: string) {
  const { text, language } = feedback;

  // Determine initial severity based on keywords
  let initialSeverity = "low";
  const criticalWords = [
    "emergency",
    "dangerous",
    "unsafe",
    "urgent",
    "immediately",
    "hazard",
  ];
  const highSeverityWords = [
    "very bad",
    "terrible",
    "awful",
    "disgusting",
    "unacceptable",
  ];

  const lowerText = text.toLowerCase();

  if (criticalWords.some((word) => lowerText.includes(word))) {
    initialSeverity = "critical";
  } else if (highSeverityWords.some((word) => lowerText.includes(word))) {
    initialSeverity = "high";
  }

  // Media attachments might indicate higher severity
  if (mediaType && initialSeverity !== "critical") {
    // Upgrade severity if media is attached (especially for negative feedback)
    if (initialSeverity === "low") initialSeverity = "medium";
    else if (initialSeverity === "medium") initialSeverity = "high";
  }

  // Use AI to analyze the sentiment and extract key issues
  const prompt = `
    Analyze the following hotel/restaurant guest feedback:
    
    ${
      language && language !== "en"
        ? "Note: This feedback may be in a language other than English."
        : ""
    }
    ${
      mediaType
        ? `The guest also shared a ${mediaType} with this feedback.`
        : ""
    }
    Feedback: "${text}"
    
    Provide a JSON response with the following structure:
    {
      "sentiment": "positive" | "negative" | "neutral",
      "severity": "critical" | "high" | "medium" | "low" | "positive",
      "category": "The main category of the feedback (e.g., Service, Food, Cleanliness, Safety)",
      "keyIssues": ["List of specific issues mentioned"],
      "requiresImmediate": true | false,
      "recommendedAction": "What action should staff take"
    }
    
    Guidelines for severity:
    - "critical": Safety issues, emergencies, or situations requiring immediate attention
    - "high": Significant problems that negatively impact guest experience
    - "medium": Issues that should be addressed soon but aren't urgent
    - "low": Minor issues or suggestions
    - "positive": Compliments and positive feedback
    
    Consider the initial severity assessment of "${initialSeverity}" based on keywords and ${
    mediaType ? "the presence of media" : "text analysis"
  }.
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
        initialSeverity === "critical" || initialSeverity === "high"
          ? "negative"
          : "neutral",
      severity: initialSeverity,
      category: mediaType ? "Visual Evidence" : "General",
      keyIssues: ["Unable to automatically categorize"],
      requiresImmediate: initialSeverity === "critical",
      recommendedAction:
        initialSeverity === "critical"
          ? "Review immediately"
          : "Review when possible",
    };
  }
}
