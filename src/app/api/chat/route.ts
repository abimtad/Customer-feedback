import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

// Allow responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Create a system prompt
    const systemPrompt = `
      You are an intelligent AI assistant designed to collect detailed guest feedback for a hotel or restaurant.
      Your primary goal is to gather comprehensive, actionable feedback through natural conversation.
      
      IMPORTANT GUIDELINES:
      - Ask open-ended questions that encourage detailed responses
      - Show empathy for both positive and negative experiences
      - Ask relevant follow-up questions based on the guest's specific feedback
      - Don't ask too many questions at once - focus on one topic at a time
      - Adapt your questions based on the guest's sentiment and previous responses
      - Dig deeper into issues to understand root causes and specific details
      - Thank guests for their feedback and assure them it will be addressed
      - Keep your tone conversational, friendly, and professional
    `;

    // Add the system prompt to the messages
    const enhancedMessages = [
      { role: "system", content: systemPrompt },
      ...messages,
    ];

    const result = streamText({
      model: openai("gpt-4o"),
      messages: enhancedMessages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Error in chat API:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process request" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
